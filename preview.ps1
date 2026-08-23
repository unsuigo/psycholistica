param(
    [int]$Port = 4173
)

$previewRoot = (Resolve-Path -LiteralPath $PSScriptRoot).Path
$previewUrl = "http://127.0.0.1:$Port/"

Write-Host "Psycholistica Premium preview"
Write-Host "Open: $previewUrl"
Write-Host "Stop the server with Ctrl+C."

$pyLauncher = Get-Command py -ErrorAction SilentlyContinue
if ($pyLauncher) {
    & $pyLauncher.Source -m http.server $Port --bind 127.0.0.1 --directory $previewRoot
    exit $LASTEXITCODE
}

$python = Get-Command python -ErrorAction SilentlyContinue
if ($python) {
    & $python.Source -m http.server $Port --bind 127.0.0.1 --directory $previewRoot
    exit $LASTEXITCODE
}

throw "Python was not found. Install Python or run any static HTTP server in this folder."
