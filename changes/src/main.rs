use anyhow::Result;
use clap::{Parser, Subcommand};
use std::path::PathBuf;

mod changeset;
mod publish;
mod release;
mod versioning;
mod workspace;

#[derive(Parser)]
#[command(
    name = "changes",
    version,
    about = "Release management CLI for primer/react packages"
)]
struct Cli {
    /// Path to workspace root (defaults to nearest directory containing a root package.json)
    #[arg(long, global = true)]
    cwd: Option<String>,

    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    /// Create a new changeset describing a set of package changes
    Add {
        /// Packages to include (flag can be repeated; prompts interactively if omitted)
        #[arg(long = "package", short = 'p')]
        packages: Vec<String>,

        /// Bump type for all listed packages: patch, minor, or major
        #[arg(long)]
        bump: Option<String>,

        /// Description of the change
        #[arg(long, short = 'm')]
        message: Option<String>,
    },

    /// Apply pending changesets: bump versions and update changelogs
    Version {
        /// Only version these specific packages (default: all affected packages)
        #[arg(long = "package", short = 'p')]
        packages: Vec<String>,
    },

    /// Publish packages to npm and create git tags / GitHub releases
    Publish {
        /// Only publish these specific packages (default: all packages with unpublished versions)
        #[arg(long = "package", short = 'p')]
        packages: Vec<String>,

        /// npm distribution tag
        #[arg(long, default_value = "latest")]
        tag: String,

        /// Print what would be done without actually publishing
        #[arg(long)]
        dry_run: bool,
    },

    /// Create a release branch, version packages, and open a pull request
    Release {
        /// Only include these packages in the release (default: all with pending changesets)
        #[arg(long = "package", short = 'p')]
        packages: Vec<String>,

        /// Branch name date suffix (YYYY-MM-DD); defaults to today's date
        #[arg(long)]
        date: Option<String>,

        /// Cherry-pick these commit SHAs onto the release branch before versioning
        #[arg(long = "cherry-pick")]
        cherry_picks: Vec<String>,

        /// Print what would be done without creating branches or PRs
        #[arg(long)]
        dry_run: bool,

        /// Create the release branch and version packages, but skip opening the PR
        #[arg(long)]
        no_pr: bool,
    },

    /// Show the current status of pending changesets
    Status,
}

fn main() -> Result<()> {
    let cli = Cli::parse();

    let cwd = match &cli.cwd {
        Some(p) => PathBuf::from(p),
        None => std::env::current_dir()?,
    };

    let root = workspace::find_root(&cwd)?;

    match &cli.command {
        Commands::Add {
            packages,
            bump,
            message,
        } => {
            changeset::cmd_add(&root, packages, bump.as_deref(), message.as_deref())?;
        }

        Commands::Version { packages } => {
            versioning::cmd_version(&root, packages)?;
        }

        Commands::Publish {
            packages,
            tag,
            dry_run,
        } => {
            publish::cmd_publish(&root, packages, tag, *dry_run)?;
        }

        Commands::Release {
            packages,
            date,
            cherry_picks,
            dry_run,
            no_pr,
        } => {
            release::cmd_release(
                &root,
                packages,
                date.as_deref(),
                cherry_picks,
                *dry_run,
                *no_pr,
            )?;
        }

        Commands::Status => {
            cmd_status(&root)?;
        }
    }

    Ok(())
}

fn cmd_status(root: &std::path::Path) -> Result<()> {
    let packages = workspace::discover_packages(root)?;
    let changesets = changeset::find_changesets(root)?;

    if changesets.is_empty() {
        println!("No pending changesets.");
        return Ok(());
    }

    // Aggregate the highest bump type per package
    let mut pending: std::collections::HashMap<String, changeset::BumpType> =
        std::collections::HashMap::new();
    for cs in &changesets {
        for (pkg, bump) in &cs.bumps {
            let current = pending
                .entry(pkg.clone())
                .or_insert(changeset::BumpType::Patch);
            if bump > current {
                *current = bump.clone();
            }
        }
    }

    println!("Pending changesets: {}", changesets.len());
    println!();

    if pending.is_empty() {
        println!("No packages will be versioned by the pending changesets.");
        return Ok(());
    }

    println!("Packages with pending version bumps:");
    let mut rows: Vec<(String, String, String, String)> = pending
        .iter()
        .map(|(pkg, bump)| {
            let current = packages
                .iter()
                .find(|p| p.name() == pkg)
                .map(|p| p.version().to_string())
                .unwrap_or_else(|| "?".to_string());
            let next = versioning::apply_bump(&current, bump);
            (
                pkg.clone(),
                current,
                "→".to_string(),
                next.unwrap_or_else(|_| "?".to_string()),
            )
        })
        .collect();
    rows.sort_by(|a, b| a.0.cmp(&b.0));

    for (pkg, current, arrow, next) in rows {
        println!("  {:<40} {} {} {}", pkg, current, arrow, next);
    }

    println!();
    println!("Changesets:");
    for cs in &changesets {
        let first_line = cs.description.lines().next().unwrap_or("(no description)");
        println!("  .changeset/{}.md  {}", cs.id, first_line);
    }

    Ok(())
}
