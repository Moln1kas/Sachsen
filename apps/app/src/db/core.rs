use sqlx::SqlitePool;
use tauri::api::path;

#[derive(Clone)]
pub struct Database {
    pub pool: SqlitePool,
}

impl Database {
    pub async fn new() -> anyhow::Result<Self> {
        let mut db_path = path::app_data_dir().expect("Failed to get app data directory");
        db_path.push("app.db");
        let db_url = format!("sqlite:{}", db_path.to_string_lossy());

        let pool = SqlitePool::connect(&db_url).await?;

        sqlx::query(
            "CREATE TABLE IF NOT EXISTS auth (
                access_token TEXT,
                refresh_token TEXT,
                expires_at INTEGER
            );",
        )
        .execute(&pool)
        .await?;

        Ok(Self { pool })
    }
}