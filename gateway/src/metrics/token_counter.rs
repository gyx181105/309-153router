//! Token 计数与费用计算
//!
//! 使用 BigDecimal 保证财务精度（f64 会有累积误差）。
//!
//! 公式：`cost = (input×markup/1000) × input_price + (output×markup/1000) × output_price`
//!
//! 全员计费 token 乘数 1.2（+20%）。单价加价（如 gpt-5.5 ×1.2）写在 `model_pricing` 表。

use bigdecimal::BigDecimal;

use crate::db::ModelPricingInfo;
use crate::router::ModelTier;

/// 计费用 token 乘数：实际用量 × 1.2
pub const BILLING_TOKEN_MARKUP: &str = "1.2";

fn billing_tokens(raw: i32) -> BigDecimal {
    BigDecimal::from(raw) * BILLING_TOKEN_MARKUP.parse::<BigDecimal>().expect("1.2")
}

/// 计算本次调用的费用（按加价后的 token 数 × 库内单价）
pub fn compute_cost(
    input_tokens:  i32,
    output_tokens: i32,
    pricing:       &ModelPricingInfo,
) -> BigDecimal {
    let k = BigDecimal::from(1000i32);
    (billing_tokens(input_tokens)  / &k) * &pricing.input_price
    + (billing_tokens(output_tokens) / &k) * &pricing.output_price
}

/// 计算相对于基准模型的节省费用
pub fn compute_savings(
    input_tokens:  i32,
    output_tokens: i32,
    actual_cost:   &BigDecimal,
    _tier:          ModelTier,
    baseline_pricing: &ModelPricingInfo,
) -> BigDecimal {
    let baseline_cost = compute_cost(input_tokens, output_tokens, baseline_pricing);
    if baseline_cost > *actual_cost {
        baseline_cost - actual_cost
    } else {
        BigDecimal::from(0)
    }
}
