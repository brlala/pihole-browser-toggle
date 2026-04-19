param(
    [Parameter(Mandatory = $true)] [string] $Version,
    [Parameter(Mandatory = $true)] [string] $OutPath
)

$ErrorActionPreference = "Stop"

$files = @(
    "manifest.json",
    "background.js",
    "popup.html",
    "popup.css",
    "popup.js",
    "options.html",
    "options.js",
    "icons/icon-16.png",
    "icons/icon-48.png",
    "icons/icon-128.png"
)

foreach ($f in $files) {
    if (-not (Test-Path $f)) {
        Write-Error "Missing required file: $f"
        exit 1
    }
}

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$outFull = [System.IO.Path]::GetFullPath($OutPath)
if (Test-Path $outFull) { Remove-Item $outFull }

$zip = [System.IO.Compression.ZipFile]::Open($outFull, [System.IO.Compression.ZipArchiveMode]::Create)
try {
    foreach ($f in $files) {
        $entryName = $f -replace "\\", "/"
        $fullPath  = [System.IO.Path]::GetFullPath($f)
        [void][System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile(
            $zip,
            $fullPath,
            $entryName,
            [System.IO.Compression.CompressionLevel]::Optimal
        )
    }
} finally {
    $zip.Dispose()
}

Write-Host "Packaged $($files.Count) files into $OutPath"
