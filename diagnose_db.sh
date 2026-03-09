#!/bin/bash

# 从 .env 加载数据库连接串
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

echo "--- 🔍 OptRouter 数据库配置诊断 ---"
echo "Target DB: $DATABASE_URL"
echo

# 检查 1: 检查虚拟模型是否已被正确标记
echo "[1. 虚拟模型标记检查]"
psql "$DATABASE_URL" -c "SELECT model_name, tier, is_virtual, enabled FROM model_pricing WHERE model_name IN ('auto', 'eco', 'balanced', 'premium', 'code', 'reasoning');"

# 检查 2: 检查核心落地模型的配置
echo -e "\n[2. 核心落地模型检查]"
psql "$DATABASE_URL" -c "SELECT model_name, provider, provider_url, tier, is_virtual FROM model_pricing WHERE model_name IN ('gpt-4o', 'gpt-4o-mini', 'claude-3-5-sonnet-20240620');"

# 检查 3: 检查分类器 (gpt-4o-mini) 是否可用
echo -e "\n[3. 分类器可用性检查]"
psql "$DATABASE_URL" -c "SELECT model_name, provider, provider_url, enabled FROM model_pricing WHERE model_name = 'gpt-4o-mini';"

# 检查 4: 查找可能导致 502 的配置异常（如 provider_url 为空或格式错误）
echo -e "\n[4. 异常配置扫描 (可能会导致 502)]"
psql "$DATABASE_URL" -c "SELECT model_name, provider, provider_url FROM model_pricing WHERE enabled = true AND (provider_url IS NULL OR provider_url = '' OR provider_url NOT LIKE 'http%');"

echo -e "\n--- ✅ 诊断完成 ---"
echo "如果 [4] 中出现了模型，或者 [2] 中的 is_virtual 为空/false，请执行之前的修复 SQL。"
