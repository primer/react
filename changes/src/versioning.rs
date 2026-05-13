use anyhow::{Context, Result};
use semver::Version;
use std::collections::HashMap;
use std::path::Path;

use crate::changeset::{BumpType, Changeset};

// ---------------------------------------------------------------------------
// Public helpers
// ---------------------------------------------------------------------------

/// Compute the next semver string after applying `bump` to `current`.
pub fn apply_bump(current: &str, bump: &BumpType) -> Result<String> {
    let mut v = Version::parse(current).with_context(|| {
        format!("Cannot parse '{}' as a semver version string.", current)
    })?;

    // Clear pre-release / build metadata when bumping
    v.pre = semver::Prerelease::EMPTY;
    v.build = semver::BuildMetadata::EMPTY;

    match bump {
        BumpType::Patch => v.patch += 1,
        BumpType::Minor => {
            v.minor += 1;
            v.patch = 0;
        }
        BumpType::Major => {
            v.major += 1;
            v.minor = 0;
            v.patch = 0;
        }
    }

    Ok(v.to_string())
}

// ---------------------------------------------------------------------------
// Aggregate changesets → per-package bump
// ---------------------------------------------------------------------------

/// Given a set of changesets and an optional filter list, return a map from
/// package name to the _highest_ bump type required across all changesets.
fn aggregate_bumps(
    changesets: &[Changeset],
    filter_packages: &[String],
) -> HashMap<String, BumpType> {
    let mut result: HashMap<String, BumpType> = HashMap::new();

    for cs in changesets {
        for (pkg, bump) in &cs.bumps {
            if !filter_packages.is_empty() && !filter_packages.iter().any(|f| f == pkg) {
                continue;
            }
            let current = result.entry(pkg.clone()).or_insert(BumpType::Patch);
            if bump > current {
                *current = bump.clone();
            }
        }
    }

    result
}

// ---------------------------------------------------------------------------
// Changelog update
// ---------------------------------------------------------------------------

/// Prepend a new section to `CHANGELOG.md` (or create it if missing).
fn update_changelog(
    changelog_path: &Path,
    new_version: &str,
    bumps_section: &str,
) -> Result<()> {
    let existing = if changelog_path.exists() {
        std::fs::read_to_string(changelog_path)
            .with_context(|| format!("Failed to read {}", changelog_path.display()))?
    } else {
        // Create with a top-level header derived from the directory name
        let pkg_name = changelog_path
            .parent()
            .and_then(|p| p.file_name())
            .and_then(|n| n.to_str())
            .unwrap_or("package");
        format!("# {}\n", pkg_name)
    };

    let new_section = format!("## {}\n\n{}\n", new_version, bumps_section.trim());

    // Insert the new section after the first heading line (if any), otherwise prepend.
    let updated = if let Some(idx) = existing.find("\n## ") {
        // `idx` is the position of the '\n' before the next `##` heading.
        // Keep that newline so we don't lose a blank line between sections.
        format!("{}\n{}\n{}", &existing[..idx], new_section, &existing[idx..])
    } else if let Some(idx) = existing.find('\n') {
        // After the first line (the top-level heading)
        format!("{}\n\n{}\n{}", &existing[..idx], new_section, &existing[idx..])
    } else {
        format!("{}\n\n{}", existing.trim_end(), new_section)
    };

    std::fs::write(changelog_path, updated)
        .with_context(|| format!("Failed to write {}", changelog_path.display()))?;

    Ok(())
}

/// Build a human-readable changelog entry for a set of changesets.
fn build_changelog_section(
    changesets: &[&Changeset],
    pkg_name: &str,
) -> String {
    let mut major_items = Vec::new();
    let mut minor_items = Vec::new();
    let mut patch_items = Vec::new();

    for cs in changesets {
        if let Some(bump) = cs.bumps.get(pkg_name) {
            let desc = cs.description.trim();
            match bump {
                BumpType::Major => major_items.push(desc.to_string()),
                BumpType::Minor => minor_items.push(desc.to_string()),
                BumpType::Patch => patch_items.push(desc.to_string()),
            }
        }
    }

    let mut section = String::new();

    if !major_items.is_empty() {
        section.push_str("### Major Changes\n\n");
        for item in &major_items {
            section.push_str(&format!("- {}\n", item));
        }
        section.push('\n');
    }

    if !minor_items.is_empty() {
        section.push_str("### Minor Changes\n\n");
        for item in &minor_items {
            section.push_str(&format!("- {}\n", item));
        }
        section.push('\n');
    }

    if !patch_items.is_empty() {
        section.push_str("### Patch Changes\n\n");
        for item in &patch_items {
            section.push_str(&format!("- {}\n", item));
        }
        section.push('\n');
    }

    section
}

// ---------------------------------------------------------------------------
// `changes version` command
// ---------------------------------------------------------------------------

pub fn cmd_version(root: &Path, filter_packages: &[String]) -> Result<()> {
    let packages = crate::workspace::discover_packages(root)?;
    let changesets = crate::changeset::find_changesets(root)?;

    if changesets.is_empty() {
        println!("No pending changesets – nothing to version.");
        return Ok(());
    }

    let bumps = aggregate_bumps(&changesets, filter_packages);

    if bumps.is_empty() {
        println!("No packages need a version bump.");
        return Ok(());
    }

    let mut versioned = 0;

    for pkg in &packages {
        let bump = match bumps.get(pkg.name()) {
            Some(b) => b,
            None => continue,
        };

        let new_version = apply_bump(pkg.version(), bump)
            .with_context(|| format!("Failed to compute new version for {}", pkg.name()))?;

        println!(
            "{}: {} → {} ({})",
            pkg.name(),
            pkg.version(),
            new_version,
            bump.as_str()
        );

        // Update package.json
        crate::workspace::update_package_version(&pkg.manifest_path, &new_version)?;

        // Find the changesets that touch this package and update CHANGELOG
        let relevant: Vec<&Changeset> = changesets
            .iter()
            .filter(|cs| cs.bumps.contains_key(pkg.name()))
            .collect();

        let changelog_section = build_changelog_section(&relevant, pkg.name());
        let changelog_path = pkg.path.join("CHANGELOG.md");
        update_changelog(&changelog_path, &new_version, &changelog_section)?;

        versioned += 1;
    }

    if versioned == 0 {
        println!("No matching packages found in workspace for the given changesets.");
        return Ok(());
    }

    // Remove consumed changeset files
    let changesets_to_remove: Vec<_> = changesets
        .iter()
        .filter(|cs| {
            cs.bumps.keys().any(|pkg| {
                if filter_packages.is_empty() {
                    bumps.contains_key(pkg.as_str())
                } else {
                    filter_packages.iter().any(|f| f == pkg)
                }
            })
        })
        .collect();

    for cs in &changesets_to_remove {
        std::fs::remove_file(&cs.path)
            .with_context(|| format!("Failed to remove changeset {}", cs.path.display()))?;
    }

    println!(
        "\n✓ Versioned {} package(s), removed {} changeset(s).",
        versioned,
        changesets_to_remove.len()
    );

    Ok(())
}
