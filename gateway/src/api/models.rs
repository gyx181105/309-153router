//! GET /v1/models — 模型列表
//! GET /v1/models/{model}/pricing — 模型定价
//!
//! TODO：生产环境应从 model_pricing 表动态读取，而不是硬编码静态列表。

use axum::{extract::Path, Json};

use crate::{
    error::AppResult,
    protocol::{ModelInfo, ModelListResponse, ModelPricingResponse},
};

pub async fn list_models() -> AppResult<Json<ModelListResponse>> {
    let data = [
        ("gpt-4o",                       "openai",    1715367049u32),
        ("gpt-4o-mini",                  "openai",    1721172717),
        ("gpt-4-turbo",                  "openai",    1704061447),
        ("gpt-4",                        "openai",    1687882411),
        ("gpt-3.5-turbo",                "openai",    1677610602),
        ("claude-3-5-sonnet-20240620",   "anthropic", 1718841600),
        ("claude-3-5-haiku-20241022",    "anthropic", 1729555200),
        ("claude-3-opus-20240229",       "anthropic", 1709164800),
        ("gemini-1.5-pro",               "google",    1712448000),
        ("gemini-1.5-flash",             "google",    1715040000),
    ];

    let models = data.iter().map(|(id, owned_by, created)| ModelInfo {
        id:       id.to_string(),
        object:   "model".into(),
        created:  *created,
        owned_by: owned_by.to_string(),
    }).collect();

    Ok(Json(ModelListResponse { object: "list".into(), data: models }))
}

pub async fn get_model_pricing(
    Path(model): Path<String>,
) -> AppResult<Json<ModelPricingResponse>> {
    // TODO: 查 model_pricing 表（目前返回静态数据）
    let pricing = [
        ("gpt-4o",             5.0,    15.0,   "openai"),
        ("gpt-4o-mini",        0.15,   0.6,    "openai"),
        ("gpt-4-turbo",        10.0,   30.0,   "openai"),
        ("gpt-4",              30.0,   60.0,   "openai"),
        ("gpt-3.5-turbo",      0.5,    1.5,    "openai"),
        ("claude-3-5-sonnet-20240620", 3.0, 15.0, "anthropic"),
        ("claude-3-5-haiku-20241022",  0.8,  4.0,  "anthropic"),
        ("claude-3-opus-20240229",     15.0, 75.0, "anthropic"),
        ("gemini-1.5-pro",     3.5,   10.5,   "google"),
        ("gemini-1.5-flash",   0.075,  0.3,   "google"),
    ];

    let found = pricing.iter().find(|(id, _, _, _)| *id == model.as_str());
    let (input_cost, output_cost, provider) = found
        .map(|(_, i, o, p)| (*i, *o, *p))
        .unwrap_or((0.0, 0.0, "unknown"));

    Ok(Json(ModelPricingResponse {
        model_name: model,
        input_cost,
        output_cost,
        provider: provider.into(),
    }))
}
