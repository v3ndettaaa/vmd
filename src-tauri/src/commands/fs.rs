use std::fs;
use std::io::Write;
use std::path::Path;
use tauri::State;
use crate::security::path_auth::SecurityContext;

pub fn read_file_internal(sec: &SecurityContext, path: &str) -> Result<String, String> {
    let target = Path::new(path);
    if !sec.is_authorized(target) {
        return Err(format!("Unauthorized access: {}", path));
    }

    fs::read_to_string(target).map_err(|e| e.to_string())
}

pub fn write_file_atomic_internal(
    sec: &SecurityContext,
    path: &str,
    content: &str,
) -> Result<(), String> {
    let target = Path::new(path);
    if !sec.is_authorized(target) {
        return Err(format!("Unauthorized write: {}", path));
    }

    let parent = target.parent().unwrap_or_else(|| Path::new("."));
    if !parent.exists() {
        fs::create_dir_all(parent).map_err(|e| e.to_string())?;
    }

    // Atomic write using tempfile in the same directory
    let mut temp = tempfile::Builder::new()
        .prefix(".vmd_tmp_")
        .tempfile_in(parent)
        .map_err(|e| e.to_string())?;

    temp.write_all(content.as_bytes())
        .map_err(|e| e.to_string())?;
    temp.flush().map_err(|e| e.to_string())?;

    temp.persist(target).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn read_text_file(sec: State<'_, SecurityContext>, path: String) -> Result<String, String> {
    read_file_internal(&sec, &path)
}

#[tauri::command]
pub fn write_text_file_atomic(
    sec: State<'_, SecurityContext>,
    path: String,
    content: String,
) -> Result<(), String> {
    write_file_atomic_internal(&sec, &path, &content)
}

#[tauri::command]
pub fn authorize_standalone_file(
    sec: State<'_, SecurityContext>,
    path: String,
) -> Result<(), String> {
    sec.authorize_file(Path::new(&path))
}

#[cfg(test)]
mod tests {
    use super::*;
    use tempfile::tempdir;

    #[test]
    fn test_atomic_save_and_read() {
        let sec = SecurityContext::new();
        let dir = tempdir().unwrap();
        let file_path = dir.path().join("test_atomic.md");
        let path_str = file_path.to_str().unwrap().to_string();

        sec.authorize_file(&file_path).unwrap();

        write_file_atomic_internal(&sec, &path_str, "# Hello VMD").unwrap();

        let read_back = read_file_internal(&sec, &path_str).unwrap();
        assert_eq!(read_back, "# Hello VMD");
    }
}
