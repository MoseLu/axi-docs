Write-Host "Testing axi-docs deployment configuration..." -ForegroundColor Green

# Check if pnpm is installed
try {
    $pnpmVersion = pnpm --version
    Write-Host "pnpm installed: $pnpmVersion" -ForegroundColor Green
} catch {
    Write-Host "pnpm not installed, please install pnpm first" -ForegroundColor Red
    exit 1
}

# Check if package.json and pnpm-lock.yaml are in sync
Write-Host "Checking dependency sync status..." -ForegroundColor Yellow
try {
    pnpm install --dry-run | Out-Null
    Write-Host "Dependencies are in sync" -ForegroundColor Green
} catch {
    Write-Host "Dependencies are out of sync, fixing..." -ForegroundColor Yellow
    pnpm install --no-frozen-lockfile
}

# Test build
Write-Host "Testing build..." -ForegroundColor Yellow
try {
    pnpm run docs:build
    Write-Host "Build successful" -ForegroundColor Green
} catch {
    Write-Host "Build failed" -ForegroundColor Red
    exit 1
}

Write-Host "All tests passed! Safe to deploy." -ForegroundColor Green 