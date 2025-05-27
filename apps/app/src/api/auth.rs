use crate::db::{auth, core::Database};
use crate::models::auth::{SignInDto, SignInResponse};
use reqwest::Client;
use std::time::{SystemTime, UNIX_EPOCH};

pub async fn sign_in(db: &Database, email: &str, password: &str) -> anyhow::Result<()> {
    let client = Client::new();
    let dto = SignInDto { email, password };

    let res = client
        .post("http://localhost:3000/api/auth/sign-in")
        .json(&dto)
        .send()
        .await?;

    if res.status().is_success() {
        let body: SignInResponse = res.json().await?;
        let now = SystemTime::now().duration_since(UNIX_EPOCH)?.as_secs() as i64;
        let expires_at = now + body.expires_in;

        auth::save_tokens(db, &body.access_token, &body.refresh_token, expires_at).await?;
        Ok(())
    } else {
        Err(anyhow::anyhow!("Failed to sign in"))
    }
}
