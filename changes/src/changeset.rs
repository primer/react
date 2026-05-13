use anyhow::{Context, Result};
use std::collections::HashMap;
use std::io::{BufRead, Write};
use std::path::{Path, PathBuf};

// ---------------------------------------------------------------------------
// BumpType
// ---------------------------------------------------------------------------

/// The semver increment to apply to a package.
#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord)]
pub enum BumpType {
    Patch,
    Minor,
    Major,
}

impl BumpType {
    pub fn parse(s: &str) -> Result<Self> {
        match s.to_lowercase().as_str() {
            "patch" => Ok(BumpType::Patch),
            "minor" => Ok(BumpType::Minor),
            "major" => Ok(BumpType::Major),
            other => Err(anyhow::anyhow!(
                "Unknown bump type '{}'. Must be patch, minor, or major.",
                other
            )),
        }
    }

    pub fn as_str(&self) -> &'static str {
        match self {
            BumpType::Patch => "patch",
            BumpType::Minor => "minor",
            BumpType::Major => "major",
        }
    }
}

// ---------------------------------------------------------------------------
// Changeset
// ---------------------------------------------------------------------------

/// A parsed `.changeset/<id>.md` file.
#[derive(Debug, Clone)]
pub struct Changeset {
    pub id: String,
    /// Map of `package-name → bump type`
    pub bumps: HashMap<String, BumpType>,
    /// The body text below the frontmatter delimiter
    pub description: String,
    pub path: PathBuf,
}

// ---------------------------------------------------------------------------
// Parsing helpers
// ---------------------------------------------------------------------------

/// Parse a single frontmatter line in any of these forms:
///   `"@primer/react": minor`
///   `'@primer/react': minor`
///   `@primer/react: minor`
fn parse_bump_line(line: &str) -> Option<(String, &str)> {
    // Find the last `:` that is not inside a quoted package name.
    // Strategy: strip any leading/trailing quotes from the package portion, then
    // locate the separator colon.
    let colon = line.rfind(':')?;
    let bump_str = line[colon + 1..].trim();
    // Strip surrounding double or single quotes from the package name
    let pkg_raw = line[..colon]
        .trim()
        .trim_matches('"')
        .trim_matches('\'')
        .to_string();
    if pkg_raw.is_empty() || bump_str.is_empty() {
        return None;
    }
    Some((pkg_raw, bump_str))
}

/// Parse a changeset file at `path`.
pub fn parse_changeset(path: &Path) -> Result<Changeset> {
    let content = std::fs::read_to_string(path)
        .with_context(|| format!("Failed to read changeset {}", path.display()))?;

    // The format is:
    //   ---\n
    //   "<pkg>": <bump>\n
    //   ...\n
    //   ---\n\n
    //   <description>
    let parts: Vec<&str> = content.splitn(3, "---").collect();
    if parts.len() < 3 {
        return Err(anyhow::anyhow!(
            "Malformed changeset (missing --- delimiters): {}",
            path.display()
        ));
    }

    let frontmatter = parts[1].trim();
    let description = parts[2].trim().to_string();

    let mut bumps = HashMap::new();
    for line in frontmatter.lines() {
        let line = line.trim();
        if line.is_empty() {
            continue;
        }
        if let Some((pkg, bump_str)) = parse_bump_line(line) {
            bumps.insert(pkg, BumpType::parse(bump_str)?);
        }
    }

    let id = path
        .file_stem()
        .and_then(|s| s.to_str())
        .unwrap_or("unknown")
        .to_string();

    Ok(Changeset {
        id,
        bumps,
        description,
        path: path.to_path_buf(),
    })
}

/// Return all pending changesets found in `<root>/.changeset/`.
pub fn find_changesets(root: &Path) -> Result<Vec<Changeset>> {
    let dir = root.join(".changeset");
    if !dir.exists() {
        return Ok(Vec::new());
    }

    let mut changesets = Vec::new();

    for entry in std::fs::read_dir(&dir).context("Failed to read .changeset directory")? {
        let entry = entry?;
        let path = entry.path();

        if path.extension().and_then(|e| e.to_str()) != Some("md") {
            continue;
        }

        let name = path
            .file_name()
            .and_then(|n| n.to_str())
            .unwrap_or_default();

        // Skip the generated README and any pre.json entry that somehow ends up .md
        if name.eq_ignore_ascii_case("README.md") {
            continue;
        }

        match parse_changeset(&path) {
            Ok(cs) => changesets.push(cs),
            Err(e) => eprintln!(
                "Warning: skipping malformed changeset {}: {}",
                path.display(),
                e
            ),
        }
    }

    // Sort for deterministic output
    changesets.sort_by(|a, b| a.id.cmp(&b.id));

    Ok(changesets)
}

// ---------------------------------------------------------------------------
// Writing a new changeset
// ---------------------------------------------------------------------------

/// Generate a short unique identifier that is safe to use as a filename.
/// We capture `SystemTime::now()` once and derive both the millisecond and
/// sub-second nanosecond components from the same instant to avoid any
/// clock skew between two separate `now()` calls.
fn generate_id() -> String {
    use std::time::{SystemTime, UNIX_EPOCH};
    let duration = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default();
    let millis = duration.as_millis();
    let nanos = duration.subsec_nanos();
    format!("{:x}-{:08x}", millis, nanos)
}

/// Write a new changeset file to `<root>/.changeset/<id>.md`.
/// Returns the filename (without directory) that was created.
pub fn write_changeset(
    root: &Path,
    bumps: &HashMap<String, BumpType>,
    description: &str,
) -> Result<String> {
    let id = generate_id();
    let dir = root.join(".changeset");
    std::fs::create_dir_all(&dir).context("Failed to create .changeset directory")?;

    let filename = format!("{}.md", id);
    let path = dir.join(&filename);

    let mut content = String::from("---\n");
    // Sort package names for deterministic output
    let mut sorted: Vec<(&String, &BumpType)> = bumps.iter().collect();
    sorted.sort_by_key(|(k, _)| k.as_str());
    for (pkg, bump) in sorted {
        content.push_str(&format!("\"{}\": {}\n", pkg, bump.as_str()));
    }
    content.push_str("---\n\n");
    content.push_str(description.trim());
    content.push('\n');

    std::fs::write(&path, &content)
        .with_context(|| format!("Failed to write changeset {}", path.display()))?;

    Ok(filename)
}

// ---------------------------------------------------------------------------
// `changes add` command
// ---------------------------------------------------------------------------

/// Interactive / flag-driven changeset creation.
pub fn cmd_add(
    root: &Path,
    packages: &[String],
    bump: Option<&str>,
    message: Option<&str>,
) -> Result<()> {
    let workspace_packages = crate::workspace::discover_packages(root)?;

    if workspace_packages.is_empty() {
        return Err(anyhow::anyhow!("No publishable packages found in the workspace."));
    }

    // ---- 1. Determine which packages to include ----
    let selected_packages: Vec<String> = if packages.is_empty() {
        // Interactive: ask user
        let names: Vec<&str> = workspace_packages.iter().map(|p| p.name()).collect();
        prompt_multiselect(
            "Which packages are affected by this change?",
            &names,
        )?
        .into_iter()
        .map(|i| names[i].to_string())
        .collect()
    } else {
        // Validate provided names
        for p in packages {
            if !workspace_packages.iter().any(|wp| wp.name() == p) {
                return Err(anyhow::anyhow!(
                    "Package '{}' not found in the workspace.",
                    p
                ));
            }
        }
        packages.to_vec()
    };

    if selected_packages.is_empty() {
        return Err(anyhow::anyhow!("No packages selected."));
    }

    // ---- 2. Determine bump type ----
    let bump_type = if let Some(b) = bump {
        BumpType::parse(b)?
    } else {
        let options = ["patch", "minor", "major"];
        let choice = prompt_select("What kind of change is this?", &options)?;
        BumpType::parse(choice)?
    };

    // ---- 3. Determine description ----
    let description = if let Some(m) = message {
        m.to_string()
    } else {
        let text = prompt("Describe the change: ")?;
        if text.is_empty() {
            return Err(anyhow::anyhow!("A description is required."));
        }
        text
    };

    // ---- 4. Build bump map and write the file ----
    let mut bumps = HashMap::new();
    for pkg in &selected_packages {
        bumps.insert(pkg.clone(), bump_type.clone());
    }

    let filename = write_changeset(root, &bumps, &description)?;
    println!("✓ Created .changeset/{}", filename);

    Ok(())
}

// ---------------------------------------------------------------------------
// Simple interactive prompts (no external TUI dependency)
// ---------------------------------------------------------------------------

fn prompt(text: &str) -> Result<String> {
    print!("{}", text);
    std::io::stdout().flush()?;
    let stdin = std::io::stdin();
    let mut line = String::new();
    stdin.lock().read_line(&mut line)?;
    Ok(line.trim_end_matches(['\n', '\r']).to_string())
}

fn prompt_select<'a>(text: &str, options: &[&'a str]) -> Result<&'a str> {
    println!("{}", text);
    for (i, opt) in options.iter().enumerate() {
        println!("  {}. {}", i + 1, opt);
    }
    loop {
        let input = prompt("Enter number: ")?;
        if let Ok(n) = input.trim().parse::<usize>() {
            if n >= 1 && n <= options.len() {
                return Ok(options[n - 1]);
            }
        }
        eprintln!("  Invalid selection – enter a number between 1 and {}", options.len());
    }
}

fn prompt_multiselect(text: &str, options: &[&str]) -> Result<Vec<usize>> {
    println!("{}", text);
    println!("  (Enter comma-separated numbers, ranges like 1-3, or 'all')");
    for (i, opt) in options.iter().enumerate() {
        println!("  {}. {}", i + 1, opt);
    }
    loop {
        let input = prompt("Your selection: ")?;
        let trimmed = input.trim();

        if trimmed.eq_ignore_ascii_case("all") {
            return Ok((0..options.len()).collect());
        }

        let mut selected = Vec::new();
        let mut ok = true;

        for part in trimmed.split(',') {
            let part = part.trim();
            if let Some((start, end)) = part.split_once('-') {
                match (start.trim().parse::<usize>(), end.trim().parse::<usize>()) {
                    (Ok(s), Ok(e)) if s >= 1 && e <= options.len() && s <= e => {
                        for i in s..=e {
                            selected.push(i - 1);
                        }
                    }
                    _ => {
                        ok = false;
                        break;
                    }
                }
            } else if let Ok(n) = part.parse::<usize>() {
                if n >= 1 && n <= options.len() {
                    selected.push(n - 1);
                } else {
                    ok = false;
                    break;
                }
            } else {
                ok = false;
                break;
            }
        }

        if ok && !selected.is_empty() {
            selected.sort_unstable();
            selected.dedup();
            return Ok(selected);
        }

        eprintln!(
            "  Invalid selection – enter numbers between 1 and {}, or 'all'.",
            options.len()
        );
    }
}
