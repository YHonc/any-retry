$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$runtimeRoot = Join-Path $projectRoot '.tools/understand-anything'
$revision = 'b8c807c632743ab695ec43cb654a0f1efe216bc8'
$major = & node -p 'Number(process.versions.node.split(".")[0])'
if ($LASTEXITCODE -ne 0 -or [int]$major -lt 22) { throw 'Node.js >= 22 is required. Select it in this shell, then retry.' }
Get-Command pnpm -ErrorAction Stop | Out-Null
if (-not (Test-Path -LiteralPath $runtimeRoot)) {
    New-Item -ItemType Directory -Force -Path (Split-Path -Parent $runtimeRoot) | Out-Null
    & git clone https://github.com/Egonex-AI/Understand-Anything.git $runtimeRoot
    if ($LASTEXITCODE -ne 0) { throw 'Upstream clone failed.' }
    & git -C $runtimeRoot checkout --detach $revision
    if ($LASTEXITCODE -ne 0) { throw 'Pinned revision checkout failed.' }
}
$actual = & git -C $runtimeRoot rev-parse HEAD
if ($actual -ne $revision) { throw "Runtime revision differs from the pin. Inspect $runtimeRoot before updating it." }
Push-Location $runtimeRoot
try {
    & pnpm install --frozen-lockfile
    if ($LASTEXITCODE -ne 0) { throw 'Dependency installation failed.' }
    & pnpm --filter '@understand-anything/core' build
    if ($LASTEXITCODE -ne 0) { throw 'Core build failed.' }
} finally { Pop-Location }
Write-Output 'Project-local Understand Anything runtime is ready. No global skills or hooks were installed.'
