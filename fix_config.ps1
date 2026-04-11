$dir = 'e:\myproject\findsharp\chiatanya-tech-world\src\features\photo-editor\components'
Get-ChildItem -Path $dir -Filter '*.jsx' | ForEach-Object {
    $content = Get-Content $_.FullName
    $content = $content -replace "from '\.\./\.\./\.\./config/photoEditorData'", "from '../config/photoEditorData'"
    Set-Content $_.FullName -Value $content -Encoding UTF8
}
Write-Host "Fixed config imports."
