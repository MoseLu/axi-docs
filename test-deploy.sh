#!/bin/bash

echo "🧪 测试 axi-docs 部署配置..."

# 检查 pnpm 是否安装
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm 未安装，请先安装 pnpm"
    exit 1
fi

echo "✅ pnpm 已安装: $(pnpm --version)"

# 检查 package.json 和 pnpm-lock.yaml 是否同步
echo "📦 检查依赖同步状态..."
if pnpm install --dry-run &> /dev/null; then
    echo "✅ 依赖同步正常"
else
    echo "❌ 依赖同步有问题，正在修复..."
    pnpm install --no-frozen-lockfile
fi

# 测试构建
echo "🔨 测试构建..."
if pnpm run docs:build; then
    echo "✅ 构建成功"
else
    echo "❌ 构建失败"
    exit 1
fi

echo "🎉 所有测试通过！可以安全部署。" 