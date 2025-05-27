use serde::{Deserialize, Serialize};

#[derive(Serialize)]
pub struct SignInDto<'a> {
    pub email: &'a str,
    pub password: &'a str,
}

#[derive(Deserialize)]
pub struct SignInResponse {
    pub access_token: String,
    pub refresh_token: String,
    pub expires_in: i64,
}
