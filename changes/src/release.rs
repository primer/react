use anyhow::{Context, Result};
use chrono::Local;
use std::path::Path;
use std::process::Command;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

fn git(args: &[&str], cwd: &Path) -> Result<String> {
    let output = Command::new("git")
        .args(args)
        .current_dir(cwd)
        .output()
        .with_context(|| format!("Failed to run `git {}`", args.join(" ")))?;

    if output.status.success() {
        Ok(String::from_utf8_lossy(&output.stdout).trim().to_string())
    } else {
        let stderr = String::from_utf8_lossy(&output.stderr);
        Err(anyhow::anyhow!(
            "`git {}` failed: {}",
            args.join(" "),
            stderr.trim()
        ))
    }
}

// ---------------------------------------------------------------------------
// `changes release` command
// ---------------------------------------------------------------------------

pub fn cmd_release(
    root: &Path,
    filter_packages: &[String],
    date: Option<&str>,
    cherry_picks: &[String],
    dry_run: bool,
    no_pr: bool,
) -> Result<()> {
    // ---- 1. Compute the branch name ----
    let date_str = match date {
        Some(d) => d.to_string(),
        None => Local::now().format("%Y-%m-%d").to_string(),
    };
    let branch = format!("release/{}", date_str);

    // ---- 2. Check there are pending changesets ----
    let changesets = crate::changeset::find_changesets(root)?;

    // When a package filter is applied, also filter down changesets
    let relevant_changesets: Vec<_> = changesets
        .iter()
        .filter(|cs| {
            if filter_packages.is_empty() {
                return true;
            }
            cs.bumps.keys().any(|p| filter_packages.iter().any(|f| f == p))
        })
        .collect();

    if relevant_changesets.is_empty() {
        println!("No pending changesets found – nothing to release.");
        return Ok(());
    }

    println!(
        "Preparing release branch '{}' with {} changeset(s).",
        branch,
        relevant_changesets.len()
    );

    if dry_run {
        println!("[dry-run] Would create branch: {}", branch);

        if !cherry_picks.is_empty() {
            for sha in cherry_picks {
                println!("[dry-run] Would cherry-pick: {}", sha);
            }
        }

        println!("[dry-run] Would run: changes version");
        println!("[dry-run] Would commit and push the branch.");

        if !no_pr {
            println!("[dry-run] Would open a PR from '{}' → 'main'.", branch);
        }

        return Ok(());
    }

    // ---- 3. Create and switch to the release branch ----
    git(&["checkout", "-b", &branch], root)
        .with_context(|| format!("Failed to create branch '{}'", branch))?;
    println!("✓ Created branch '{}'", branch);

    // ---- 4. Cherry-pick commits (if any) ----
    for sha in cherry_picks {
        git(&["cherry-pick", sha], root)
            .with_context(|| format!("Failed to cherry-pick {}", sha))?;
        println!("✓ Cherry-picked {}", sha);
    }

    // ---- 5. Run `changes version` ----
    crate::versioning::cmd_version(root, filter_packages)
        .context("Failed to version packages")?;

    // ---- 6. Commit the version bumps ----
    // Stage all modified package.json, CHANGELOG.md, and .changeset files
    git(&["add", "--all"], root).context("Failed to stage changes")?;

    let commit_msg = format!("chore: version packages for {}", date_str);
    git(&["commit", "-m", &commit_msg], root)
        .context("Failed to commit version bump")?;
    println!("✓ Committed version bump");

    // ---- 7. Push the release branch ----
    git(&["push", "--set-upstream", "origin", &branch], root)
        .with_context(|| format!("Failed to push branch '{}'", branch))?;
    println!("✓ Pushed branch '{}'", branch);

    // ---- 8. Open a pull request ----
    if !no_pr {
        create_pull_request(root, &branch, &date_str, relevant_changesets.len())?;
    } else {
        println!(
            "Skipped PR creation (--no-pr). Push '{}' and open a PR manually.",
            branch
        );
    }

    Ok(())
}

fn create_pull_request(
    root: &Path,
    branch: &str,
    date_str: &str,
    changeset_count: usize,
) -> Result<()> {
    let title = format!("Release {}", date_str);
    let body = format!(
        "This pull request versions packages based on {} pending changeset(s).\n\n\
         Merging this PR will trigger the publish workflow, which will:\n\
         - Publish updated packages to npm\n\
         - Create git tags for each published package\n\
         - Create GitHub releases for each tag\n",
        changeset_count
    );

    let result = Command::new("gh")
        .args([
            "pr",
            "create",
            "--base",
            "main",
            "--head",
            branch,
            "--title",
            &title,
            "--body",
            &body,
            "--label",
            "release",
        ])
        .current_dir(root)
        .status();

    match result {
        Ok(s) if s.success() => println!("✓ Opened pull request for '{}'", branch),
        Ok(_) => eprintln!(
            "Warning: `gh pr create` failed. \
             Install the GitHub CLI (https://cli.github.com) or open the PR manually."
        ),
        Err(_) => eprintln!(
            "Warning: `gh` not found. \
             Install the GitHub CLI or open the PR manually from branch '{}'.",
            branch
        ),
    }

    Ok(())
}
