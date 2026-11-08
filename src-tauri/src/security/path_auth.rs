use std::collections::HashSet;
use std::path::{Path, PathBuf};
use std::sync::Mutex;

pub struct SecurityContext {
    workspace_root: Mutex<Option<PathBuf>>,
    authorized_files: Mutex<HashSet<PathBuf>>,
}

impl SecurityContext {
    pub fn new() -> Self {
        Self {
            workspace_root: Mutex::new(None),
            authorized_files: Mutex::new(HashSet::new()),
        }
    }

    pub fn set_workspace_root(&self, path: PathBuf) -> Result<(), String> {
        let canonical = path.canonicalize().map_err(|e| e.to_string())?;
        if !canonical.is_dir() {
            return Err("Workspace root must be a directory".into());
        }
        let mut root = self.workspace_root.lock().map_err(|e| e.to_string())?;
        *root = Some(canonical);
        Ok(())
    }

    pub fn authorize_file(&self, path: &Path) -> Result<(), String> {
        let canonical = if path.exists() {
            path.canonicalize().map_err(|e| e.to_string())?
        } else {
            // For new files, canonicalize parent dir and join filename
            let parent = path.parent().unwrap_or_else(|| Path::new("."));
            let canon_parent = parent.canonicalize().map_err(|e| e.to_string())?;
            let file_name = path.file_name().ok_or("Invalid filename")?;
            canon_parent.join(file_name)
        };

        let mut files = self.authorized_files.lock().map_err(|e| e.to_string())?;
        files.insert(canonical);
        Ok(())
    }

    pub fn is_authorized(&self, path: &Path) -> bool {
        // Resolve canonical representation
        let target = if path.exists() {
            match path.canonicalize() {
                Ok(p) => p,
                Err(_) => return false,
            }
        } else {
            let parent = match path.parent() {
                Some(p) => p,
                None => return false,
            };
            let canon_parent = match parent.canonicalize() {
                Ok(p) => p,
                Err(_) => return false,
            };
            let file_name = match path.file_name() {
                Some(f) => f,
                None => return false,
            };
            canon_parent.join(file_name)
        };

        if let Ok(root_guard) = self.workspace_root.lock() {
            if let Some(root) = root_guard.as_ref() {
                if target.starts_with(root) {
                    return true;
                }
            }
        }

        // 2. Check explicit standalone files
        if let Ok(files_guard) = self.authorized_files.lock() {
            if files_guard.contains(&target) {
                return true;
            }
        }

        false
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use tempfile::tempdir;
    use std::fs::File;

    #[test]
    fn test_workspace_authorization() {
        let sec = SecurityContext::new();
        let dir = tempdir().unwrap();
        let dir_path = dir.path().to_path_buf();
        sec.set_workspace_root(dir_path.clone()).unwrap();

        let subfile = dir_path.join("note.md");
        File::create(&subfile).unwrap();

        assert!(sec.is_authorized(&subfile));

        let outside_dir = tempdir().unwrap();
        let outside_file = outside_dir.path().join("secret.txt");
        File::create(&outside_file).unwrap();

        assert!(!sec.is_authorized(&outside_file));
    }

    #[test]
    fn test_standalone_file_authorization() {
        let sec = SecurityContext::new();
        let dir = tempdir().unwrap();
        let file = dir.path().join("standalone.md");
        File::create(&file).unwrap();

        assert!(!sec.is_authorized(&file));
        sec.authorize_file(&file).unwrap();
        assert!(sec.is_authorized(&file));
    }
}
