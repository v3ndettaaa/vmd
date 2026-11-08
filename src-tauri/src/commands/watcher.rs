use serde::{Deserialize, Serialize};
use std::fs;
use std::path::{Path, PathBuf};
use tauri::State;
use crate::security::path_auth::SecurityContext;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct FileNode {
    pub name: string_or_path::Name,
    pub path: String,
    pub is_dir: bool,
    pub children: Option<Vec<FileNode>>,
}

mod string_or_path {
    pub type Name = String;
}

const IGNORED_DIRS: &[&str] = &[".git", "node_modules", "target", "dist", ".cache"];

pub fn scan_dir_recursive(dir: &Path) -> Result<Vec<FileNode>, String> {
    if !dir.is_dir() {
        return Err("Not a directory".into());
    }

    let mut entries = Vec::new();
    let read_dir = fs::read_dir(dir).map_err(|e| e.to_string())?;

    for entry in read_dir.flatten() {
        let path = entry.path();
        let name = entry.file_name().to_string_lossy().to_string();

        if path.is_dir() {
            if IGNORED_DIRS.contains(&name.as_str()) {
                continue;
            }
            let children = scan_dir_recursive(&path).unwrap_or_default();
            entries.push(FileNode {
                name,
                path: path.to_string_lossy().to_string(),
                is_dir: true,
                children: Some(children),
            });
        } else {
            // Include only markdown and text files
            if name.ends_with(".md") || name.ends_with(".markdown") || name.ends_with(".txt") {
                entries.push(FileNode {
                    name,
                    path: path.to_string_lossy().to_string(),
                    is_dir: false,
                    children: None,
                });
            }
        }
    }

    // Sort: directories first, then alphabetical
    entries.sort_by(|a, b| {
        match (a.is_dir, b.is_dir) {
            (true, false) => std::cmp::Ordering::Less,
            (false, true) => std::cmp::Ordering::Greater,
            _ => a.name.to_lowercase().cmp(&b.name.to_lowercase()),
        }
    });

    Ok(entries)
}

#[tauri::command]
pub fn open_workspace(
    sec: State<'_, SecurityContext>,
    dir: String,
) -> Result<Vec<FileNode>, String> {
    let path = PathBuf::from(&dir);
    sec.set_workspace_root(path.clone())?;
    scan_dir_recursive(&path)
}

#[cfg(test)]
mod tests {
    use super::*;
    use tempfile::tempdir;
    use std::fs::File;

    #[test]
    fn test_scan_dir_ordering_and_filtering() {
        let dir = tempdir().unwrap();
        let root = dir.path();

        // Create files and dirs
        fs::create_dir(root.join("docs")).unwrap();
        fs::create_dir(root.join(".git")).unwrap();
        File::create(root.join("docs").join("guide.md")).unwrap();
        File::create(root.join("README.md")).unwrap();
        File::create(root.join("binary.bin")).unwrap();

        let nodes = scan_dir_recursive(root).unwrap();

        // .git and binary.bin should be ignored
        assert_eq!(nodes.len(), 2);
        assert!(nodes[0].is_dir); // docs first
        assert_eq!(nodes[0].name, "docs");
        assert!(!nodes[1].is_dir); // README.md second
        assert_eq!(nodes[1].name, "README.md");
    }
}
