$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$runtimeRoot = Join-Path $projectRoot '.tools/understand-anything'
$dashboardRoot = Join-Path $runtimeRoot 'understand-anything-plugin/packages/dashboard'
$outputRoot = Join-Path $projectRoot 'docs/map'
if ([System.IO.Path]::GetFullPath($outputRoot) -ne [System.IO.Path]::GetFullPath((Join-Path $projectRoot 'docs/map'))) { throw 'Unexpected output path.' }
if ((Test-Path -LiteralPath $outputRoot) -and ((Get-Item -LiteralPath $outputRoot).Attributes -band [System.IO.FileAttributes]::ReparsePoint)) { throw 'Refusing to clean a linked output directory.' }
$graphHash = (Get-FileHash -Algorithm SHA256 -LiteralPath (Join-Path $projectRoot '.ua/knowledge-graph.json')).Hash.ToLowerInvariant().Substring(0, 16)
if (-not (Test-Path -LiteralPath (Join-Path $dashboardRoot 'vite.config.demo.ts'))) { throw 'Run scripts/setup-map.ps1 first.' }
Push-Location $projectRoot
try {
    & node scripts/validate-map.mjs
    if ($LASTEXITCODE -ne 0) { throw 'Graph validation failed.' }
    Push-Location $runtimeRoot
    try {
        $previousGraphUrl = $env:VITE_GRAPH_URL
        $env:VITE_GRAPH_URL = "./knowledge-graph.json?v=$graphHash"
        & pnpm --filter '@understand-anything/dashboard' exec vite build --config vite.config.demo.ts --base ./ --outDir $outputRoot --emptyOutDir
        if ($LASTEXITCODE -ne 0) { throw 'Static dashboard build failed.' }
    } finally { $env:VITE_GRAPH_URL = $previousGraphUrl; Pop-Location }
    & node scripts/publish-map.mjs
    if ($LASTEXITCODE -ne 0) { throw 'Map packaging failed.' }
} finally { Pop-Location }
