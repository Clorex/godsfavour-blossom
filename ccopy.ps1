function ccopy($p){
  Get-Content -Raw $p | Set-Clipboard
  Write-Host "Copied to clipboard: $p"
}
