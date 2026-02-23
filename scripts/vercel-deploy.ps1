param(
  [Parameter(Mandatory = $true)]
  [string]$VercelToken,
  [Parameter(Mandatory = $false)]
  [string]$Scope = ""
)

$ErrorActionPreference = "Stop"

$required = @(
  "DATABASE_URL",
  "CLERK_SECRET_KEY",
  "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
  "UPLOADTHING_TOKEN",
  "NEXT_PUBLIC_SITE_URL"
)

foreach ($name in $required) {
  if (-not (Get-Item "Env:$name" -ErrorAction SilentlyContinue)) {
    throw "Missing required environment variable in current shell: $name"
  }
}

function Invoke-Vercel {
  param([string]$Args)
  if ([string]::IsNullOrWhiteSpace($Scope)) {
    npx vercel $Args --token $VercelToken
  } else {
    npx vercel $Args --token $VercelToken --scope $Scope
  }
}

Write-Host "Linking Vercel project..."
Invoke-Vercel "link --yes"

Write-Host "Setting Preview and Production env vars..."
foreach ($name in $required) {
  $value = (Get-Item "Env:$name").Value
  $tmp = New-TemporaryFile
  try {
    Set-Content -Path $tmp -Value $value -NoNewline
    if ([string]::IsNullOrWhiteSpace($Scope)) {
      Get-Content $tmp | npx vercel env add $name preview --token $VercelToken
      Get-Content $tmp | npx vercel env add $name production --token $VercelToken
    } else {
      Get-Content $tmp | npx vercel env add $name preview --token $VercelToken --scope $Scope
      Get-Content $tmp | npx vercel env add $name production --token $VercelToken --scope $Scope
    }
  } finally {
    Remove-Item $tmp -Force -ErrorAction SilentlyContinue
  }
}

Write-Host "Pulling production env config..."
Invoke-Vercel "pull --yes --environment=production"

Write-Host "Deploying to production..."
if ([string]::IsNullOrWhiteSpace($Scope)) {
  npx vercel --prod --yes --token $VercelToken
} else {
  npx vercel --prod --yes --token $VercelToken --scope $Scope
}
