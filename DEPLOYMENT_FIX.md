# Axi-Docs 部署问题解决方案

## 问题描述

在使用 axi-deploy 工作流部署 axi-docs 业务仓库时出现以下错误：

```
ERR_PNPM_OUTDATED_LOCKFILE  Cannot install with "frozen-lockfile" because pnpm-lock.yaml is not up to date with <ROOT>/package.json
```

## 问题原因

1. `pnpm-lock.yaml` 文件与 `package.json` 文件不同步
2. CI 环境中默认启用了 `--frozen-lockfile` 选项
3. 部署配置使用了 npm 而不是 pnpm

## 解决方案

### 1. 修复本地依赖同步

```bash
# 删除旧的依赖和锁文件
rm -rf node_modules pnpm-lock.yaml

# 重新安装依赖
pnpm install
```

### 2. 更新 GitHub Actions 配置

已更新 `.github/workflows/build.yml` 文件，确保：

- 使用正确的 pnpm 版本 (10.7.1)
- 启用 pnpm 缓存
- 使用 `--frozen-lockfile` 选项

### 3. 创建专门的 pnpm 部署配置

在 `axi-deploy/examples/axi-docs-pnpm-deploy.yml` 中创建了专门针对 pnpm 项目的部署配置。

## 验证步骤

运行测试脚本验证配置：

```powershell
# Windows PowerShell
powershell -ExecutionPolicy Bypass -File test-deploy.ps1

# Linux/Mac
bash test-deploy.sh
```

## 关键配置要点

1. **pnpm 版本**: 确保使用 10.7.1 版本
2. **缓存配置**: 使用 `cache: 'pnpm'` 而不是 `cache: 'npm'`
3. **安装命令**: 使用 `pnpm install --frozen-lockfile`
4. **构建命令**: 使用 `pnpm run docs:build`

## 部署流程

1. 推送代码到 main 分支
2. GitHub Actions 自动触发构建
3. 使用 pnpm 安装依赖和构建项目
4. 上传构建产物
5. 触发 axi-deploy 部署流程

## 注意事项

- 确保 `package.json` 和 `pnpm-lock.yaml` 保持同步
- 在 CI 环境中使用 `--frozen-lockfile` 确保依赖版本一致性
- 定期更新 pnpm 版本以获取最新功能和修复 