//! GET /health — 健康检查
//!
//! 无需认证，用于 K8s liveness/readiness probe。

use axum::Json;
use serde_json::json;

pub async fn health_check() -> Json<serde_json::Value> {
    Json(json!({
        "status":  "healthy",
        "version": env!("CARGO_PKG_VERSION"),
    }))
}
