use rusqlite::{params, Connection};
use std::fs;
use std::path::PathBuf;
use std::sync::Mutex;

pub struct Database {
    conn: Mutex<Connection>,
}

impl Database {
    pub fn new(path: Option<PathBuf>) -> Result<Self, String> {
        let conn = match path {
            Some(p) => {
                if let Some(parent) = p.parent() {
                    fs::create_dir_all(parent).map_err(|e| e.to_string())?;
                }
                Connection::open(p).map_err(|e| e.to_string())?
            }
            None => Connection::open_in_memory().map_err(|e| e.to_string())?,
        };

        conn.execute(
            "CREATE TABLE IF NOT EXISTS session (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL
            )",
            [],
        )
        .map_err(|e| e.to_string())?;

        Ok(Self {
            conn: Mutex::new(conn),
        })
    }

    pub fn save(&self, key: &str, value: &str) -> Result<(), String> {
        let conn = self.conn.lock().map_err(|e| e.to_string())?;
        conn.execute(
            "INSERT INTO session (key, value) VALUES (?1, ?2)
             ON CONFLICT(key) DO UPDATE SET value = excluded.value",
            params![key, value],
        )
        .map_err(|e| e.to_string())?;
        Ok(())
    }

    pub fn load(&self, key: &str) -> Result<Option<String>, String> {
        let conn = self.conn.lock().map_err(|e| e.to_string())?;
        let mut stmt = conn
            .prepare("SELECT value FROM session WHERE key = ?1")
            .map_err(|e| e.to_string())?;
        let mut rows = stmt.query(params![key]).map_err(|e| e.to_string())?;

        if let Some(row) = rows.next().map_err(|e| e.to_string())? {
            let val: String = row.get(0).map_err(|e| e.to_string())?;
            Ok(Some(val))
        } else {
            Ok(None)
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_sqlite_session_persistence() {
        let db = Database::new(None).unwrap();

        assert_eq!(db.load("last_tab").unwrap(), None);

        db.save("last_tab", "tab-123").unwrap();
        assert_eq!(db.load("last_tab").unwrap(), Some("tab-123".into()));

        // Update existing key
        db.save("last_tab", "tab-456").unwrap();
        assert_eq!(db.load("last_tab").unwrap(), Some("tab-456".into()));
    }
}
