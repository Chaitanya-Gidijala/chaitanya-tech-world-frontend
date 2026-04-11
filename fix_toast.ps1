$dir1 = 'e:\myproject\findsharp\chiatanya-tech-world\src\features\job-portal\components\admin'
Get-ChildItem -Path $dir1 -Filter '*.jsx' | ForEach-Object {
    $content = Get-Content $_.FullName
    $content = $content -replace "from '\.\./common/Toast'", "from '@/components/ui/Toast'"
    Set-Content $_.FullName -Value $content -Encoding UTF8
}

$dir2 = 'e:\myproject\findsharp\chiatanya-tech-world\src\features\job-portal\components\prep'
Get-ChildItem -Path $dir2 -Filter '*.jsx' | ForEach-Object {
    $content = Get-Content $_.FullName
    $content = $content -replace "from '\.\./common/Toast'", "from '@/components/ui/Toast'"
    Set-Content $_.FullName -Value $content -Encoding UTF8
}

Write-Host "Fixed Toast imports."
