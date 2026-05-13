use anyhow::{Context, Result};
use serde::Deserialize;
use std::path::{Path, PathBuf};

/// Minimal subset of a package.json manifest that `changes` needs.
#[derive(Debug, Clone, Deserialize)]
pub struct PackageJson {
    pub name: String,
    pub version: String,
    #[serde(default)]
    pub private: bool,
}

/// A package discovered inside the workspace.
#[derive(Debug, Clone)]
pub struct Package {
    pub manifest: PackageJson,
    /// Directory that contains the package.json
    pub path: PathBuf,
    /// Full path to the package.json file
    pub manifest_path: PathBuf,
}

impl Package {
    pub fn name(&self) -> &str {
        &self.manifest.name
    }

    pub fn version(&self) -> &str {
        &self.manifest.version
    }

    #[allow(dead_code)]
    pub fn is_private(&self) -> bool {
        self.manifest.private
    }
}

/// Walk up from `start` until we find a directory that contains a package.json
/// with a `workspaces` field (the monorepo root).
pub fn find_root(start: &Path) -> Result<PathBuf> {
    let mut current = start.to_path_buf();
    loop {
        let pkg = current.join("package.json");
        if pkg.exists() {
            let content = std::fs::read_to_string(&pkg)
                .with_context(|| format!("Failed to read {}", pkg.display()))?;
            let json: serde_json::Value = serde_json::from_str(&content)?;
            if json.get("workspaces").is_some() {
                return Ok(current);
            }
        }
        if !current.pop() {
            break;
        }
    }
    Err(anyhow::anyhow!(
        "Could not find a workspace root (package.json with 'workspaces') starting from {}",
        start.display()
    ))
}

/// Discover all non-private packages listed in the root `workspaces` globs.
pub fn discover_packages(root: &Path) -> Result<Vec<Package>> {
    let root_manifest_path = root.join("package.json");
    let content = std::fs::read_to_string(&root_manifest_path)
        .context("Failed to read root package.json")?;
    let root_json: serde_json::Value = serde_json::from_str(&content)?;

    let workspaces = root_json["workspaces"]
        .as_array()
        .context("Missing or invalid 'workspaces' field in root package.json")?;

    let mut packages = Vec::new();

    for workspace_glob in workspaces {
        let pattern_suffix = workspace_glob.as_str().unwrap_or_default();
        let full_pattern = root
            .join(pattern_suffix)
            .join("package.json")
            .to_string_lossy()
            .into_owned();

        for entry in glob::glob(&full_pattern).context("Invalid workspace glob")? {
            let manifest_path = entry.context("Glob iteration error")?;

            // Skip anything inside node_modules
            if manifest_path
                .components()
                .any(|c| c.as_os_str() == "node_modules")
            {
                continue;
            }

            let pkg_content = std::fs::read_to_string(&manifest_path)
                .with_context(|| format!("Failed to read {}", manifest_path.display()))?;

            let manifest: PackageJson = match serde_json::from_str(&pkg_content) {
                Ok(m) => m,
                Err(e) => {
                    eprintln!(
                        "Warning: skipping {} ({})",
                        manifest_path.display(),
                        e
                    );
                    continue;
                }
            };

            // Skip private packages – they are not published to npm
            if manifest.private {
                continue;
            }

            let path = manifest_path
                .parent()
                .expect("package.json always has a parent directory")
                .to_path_buf();

            packages.push(Package {
                manifest,
                path,
                manifest_path,
            });
        }
    }

    // Deduplicate by canonical manifest path so that packages listed both
    // explicitly (e.g. "packages/react") and via a glob (e.g. "packages/*")
    // only appear once.
    let mut seen_paths = std::collections::HashSet::new();
    packages.retain(|p| {
        let canonical = p
            .manifest_path
            .canonicalize()
            .unwrap_or_else(|_| p.manifest_path.clone());
        seen_paths.insert(canonical)
    });

    Ok(packages)
}

/// Overwrite the `version` field inside a package.json file, preserving all
/// other content and the original indentation / trailing newline style.
pub fn update_package_version(manifest_path: &Path, new_version: &str) -> Result<()> {
    let content = std::fs::read_to_string(manifest_path)
        .with_context(|| format!("Failed to read {}", manifest_path.display()))?;

    let mut json: serde_json::Value = serde_json::from_str(&content)?;

    json["version"] = serde_json::Value::String(new_version.to_string());

    // Serialize with 2-space indentation (the npm/JS community standard) and a
    // trailing newline so we don't generate spurious diffs.
    let mut serialized = serde_json::to_string_pretty(&json)?;
    serialized.push('\n');

    std::fs::write(manifest_path, serialized)
        .with_context(|| format!("Failed to write {}", manifest_path.display()))?;

    Ok(())
}
