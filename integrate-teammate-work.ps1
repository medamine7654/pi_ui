# PowerShell Integration Helper Script
# Run this to help integrate teammate work

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  Team Integration Helper" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Function to create backup
function Create-Backup {
    Write-Host "Creating backup..." -ForegroundColor Yellow
    $backupName = "backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
    
    # Git backup
    if (Test-Path ".git") {
        git add .
        git commit -m "Pre-integration backup"
        git branch $backupName
        Write-Host "✓ Git backup created: $backupName" -ForegroundColor Green
    } else {
        # Manual backup
        $backupPath = "../$backupName"
        Copy-Item -Path "." -Destination $backupPath -Recurse -Force
        Write-Host "✓ Manual backup created: $backupPath" -ForegroundColor Green
    }
}

# Function to check current state
function Check-CurrentState {
    Write-Host "`nChecking current state..." -ForegroundColor Yellow
    
    # Clear cache
    php bin/console cache:clear
    
    # Check schema
    Write-Host "`nDatabase Schema Status:" -ForegroundColor Cyan
    php bin/console doctrine:schema:validate
    
    # Check routes
    Write-Host "`nRoutes:" -ForegroundColor Cyan
    php bin/console debug:router | Select-Object -First 10
    Write-Host "... (showing first 10 routes)" -ForegroundColor Gray
}

# Function to analyze teammate files
function Analyze-TeammateFiles {
    param (
        [string]$teammateName,
        [string]$filesPath
    )
    
    Write-Host "`n=== Analyzing $teammateName's Files ===" -ForegroundColor Cyan
    
    if (Test-Path $filesPath) {
        Write-Host "Files found in: $filesPath" -ForegroundColor Green
        
        # List PHP files
        $phpFiles = Get-ChildItem -Path $filesPath -Filter "*.php" -Recurse
        Write-Host "`nPHP Files ($($phpFiles.Count)):" -ForegroundColor Yellow
        $phpFiles | ForEach-Object { Write-Host "  - $($_.FullName)" }
        
        # List Twig files
        $twigFiles = Get-ChildItem -Path $filesPath -Filter "*.twig" -Recurse
        Write-Host "`nTwig Files ($($twigFiles.Count)):" -ForegroundColor Yellow
        $twigFiles | ForEach-Object { Write-Host "  - $($_.FullName)" }
        
        # List migration files
        $migrationFiles = Get-ChildItem -Path $filesPath -Filter "Version*.php" -Recurse
        Write-Host "`nMigration Files ($($migrationFiles.Count)):" -ForegroundColor Yellow
        $migrationFiles | ForEach-Object { Write-Host "  - $($_.FullName)" }
        
    } else {
        Write-Host "Path not found: $filesPath" -ForegroundColor Red
    }
}

# Function to integrate files
function Integrate-Files {
    param (
        [string]$sourcePath,
        [string]$destinationPath
    )
    
    Write-Host "`nIntegrating files from $sourcePath to $destinationPath..." -ForegroundColor Yellow
    
    if (Test-Path $sourcePath) {
        Copy-Item -Path "$sourcePath\*" -Destination $destinationPath -Recurse -Force
        Write-Host "✓ Files copied successfully" -ForegroundColor Green
    } else {
        Write-Host "✗ Source path not found" -ForegroundColor Red
    }
}

# Function to run post-integration checks
function Run-PostIntegrationChecks {
    Write-Host "`n=== Running Post-Integration Checks ===" -ForegroundColor Cyan
    
    # Install dependencies
    Write-Host "`n1. Installing dependencies..." -ForegroundColor Yellow
    composer install
    
    # Clear cache
    Write-Host "`n2. Clearing cache..." -ForegroundColor Yellow
    php bin/console cache:clear
    
    # Run migrations
    Write-Host "`n3. Running migrations..." -ForegroundColor Yellow
    php bin/console doctrine:migrations:migrate --no-interaction
    
    # Validate schema
    Write-Host "`n4. Validating schema..." -ForegroundColor Yellow
    php bin/console doctrine:schema:validate
    
    # Check routes
    Write-Host "`n5. Checking routes..." -ForegroundColor Yellow
    php bin/console debug:router | Select-Object -First 5
    
    # Lint templates
    Write-Host "`n6. Linting templates..." -ForegroundColor Yellow
    php bin/console lint:twig templates/
    
    Write-Host "`n✓ Post-integration checks complete!" -ForegroundColor Green
}

# Main Menu
function Show-Menu {
    Write-Host "`n=== Integration Menu ===" -ForegroundColor Cyan
    Write-Host "1. Create Backup"
    Write-Host "2. Check Current State"
    Write-Host "3. Analyze Teammate Files"
    Write-Host "4. Integrate Teammate 1"
    Write-Host "5. Integrate Teammate 2"
    Write-Host "6. Integrate Teammate 3"
    Write-Host "7. Run Post-Integration Checks"
    Write-Host "8. View Integration Guide"
    Write-Host "9. Exit"
    Write-Host ""
}

# Main Loop
do {
    Show-Menu
    $choice = Read-Host "Select an option (1-9)"
    
    switch ($choice) {
        "1" {
            Create-Backup
        }
        "2" {
            Check-CurrentState
        }
        "3" {
            $teammateName = Read-Host "Enter teammate name"
            $filesPath = Read-Host "Enter path to teammate's files"
            Analyze-TeammateFiles -teammateName $teammateName -filesPath $filesPath
        }
        "4" {
            Write-Host "`nIntegrating Teammate 1..." -ForegroundColor Cyan
            $sourcePath = Read-Host "Enter source path for Teammate 1"
            # You can customize destination paths
            Write-Host "Copy files manually or specify paths" -ForegroundColor Yellow
        }
        "5" {
            Write-Host "`nIntegrating Teammate 2..." -ForegroundColor Cyan
            $sourcePath = Read-Host "Enter source path for Teammate 2"
            Write-Host "Copy files manually or specify paths" -ForegroundColor Yellow
        }
        "6" {
            Write-Host "`nIntegrating Teammate 3..." -ForegroundColor Cyan
            $sourcePath = Read-Host "Enter source path for Teammate 3"
            Write-Host "Copy files manually or specify paths" -ForegroundColor Yellow
        }
        "7" {
            Run-PostIntegrationChecks
        }
        "8" {
            if (Test-Path "INTEGRATION_GUIDE.md") {
                Get-Content "INTEGRATION_GUIDE.md" | Select-Object -First 50
                Write-Host "`n... (showing first 50 lines, open INTEGRATION_GUIDE.md for full guide)" -ForegroundColor Gray
            } else {
                Write-Host "INTEGRATION_GUIDE.md not found" -ForegroundColor Red
            }
        }
        "9" {
            Write-Host "`nGoodbye!" -ForegroundColor Cyan
            break
        }
        default {
            Write-Host "Invalid option. Please try again." -ForegroundColor Red
        }
    }
    
    if ($choice -ne "9") {
        Read-Host "`nPress Enter to continue"
    }
    
} while ($choice -ne "9")
