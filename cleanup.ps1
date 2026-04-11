$root = 'e:\myproject\findsharp\chiatanya-tech-world'
$src = "$root\src"

# Remove old apps/ directory (all content moved to features/)
Remove-Item "$src\apps" -Recurse -Force -ErrorAction SilentlyContinue

# Remove old lib/ directory (moved to utils/)
Remove-Item "$src\lib" -Recurse -Force -ErrorAction SilentlyContinue

# Remove old NavLink.jsx from root of components (now lives in components/ui/)
Remove-Item "$src\components\NavLink.jsx" -Force -ErrorAction SilentlyContinue

# Remove LandingPage.css from styles/ (moved to pages/common/)
Remove-Item "$src\styles\LandingPage.css" -Force -ErrorAction SilentlyContinue

# Remove config/theme.js (moved to constants/theme.js)
Remove-Item "$src\config\theme.js" -Force -ErrorAction SilentlyContinue

# Remove config/photoEditorConfig.js and photoEditorData.js (moved to features/photo-editor/config/)
Remove-Item "$src\config\photoEditorConfig.js" -Force -ErrorAction SilentlyContinue
Remove-Item "$src\config\photoEditorData.js" -Force -ErrorAction SilentlyContinue

# Move scratch files to project root (out of src)
Move-Item "$src\append.js" "$root\append.js" -Force -ErrorAction SilentlyContinue
Move-Item "$src\refactor.cjs" "$root\refactor.cjs" -Force -ErrorAction SilentlyContinue

# Clean up the temp ps1 scripts we created at project root
Remove-Item "$root\make_dirs.ps1" -Force -ErrorAction SilentlyContinue
Remove-Item "$root\move_files.ps1" -Force -ErrorAction SilentlyContinue

Write-Host "Cleanup complete."
