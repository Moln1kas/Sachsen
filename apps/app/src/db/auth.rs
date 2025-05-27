use super::core::Database;
use sqlx::Row;

pub async fn save_tokens(
    db: &Database,
    access: &str,
    refresh: &str,
    expires_at: i64,
) -> anyhow::Result<()> {
    sqlx::query("DELETE FROM auth").execute(&db.pool).await?;
    sqlx::query("INSERT INTO auth (access_token, refresh_token, expires_at) VALUES (?, ?, ?)")
        .bind(access)
        .bind(refresh)
        .bind(expires_at)
        .execute(&db.pool)
        .await?;
    Ok(())
}

pub async fn get_tokens(db: &Database) -> anyhow::Result<(String, String)> {
    let row = sqlx::query("SELECT access_token, refresh_token FROM auth LIMIT 1")
        .fetch_one(&db.pool)
        .await?;

    Ok((row.get("access_token"), row.get("refresh_token")))
}
