# setup_db.ps1
# This script initializes the lifestyle_products database by running the SQL scripts in order.

$Password = Read-Host -AsSecureString "Enter your MySQL root password"
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($Password)
$PlainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

$MySqlPath = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
if (-not (Test-Path $MySqlPath)) {
    $MySqlPath = "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe"
}
if (-not (Test-Path $MySqlPath)) {
    $MySqlPath = "mysql"
}

Write-Host "Re-creating database 'lifestyle_products'..." -ForegroundColor Green
& $MySqlPath -h 127.0.0.1 -u root -p"$PlainPassword" -e "DROP DATABASE IF EXISTS lifestyle_products; CREATE DATABASE lifestyle_products CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to connect to MySQL or create database. Please check your password and verify MySQL is running."
    exit $LASTEXITCODE
}

Write-Host "Executing table schema creation scripts..." -ForegroundColor Green
$TableScripts = Get-ChildItem "db/tables/*.sql" | Sort-Object Name
foreach ($Script in $TableScripts) {
    Write-Host "Running $($Script.Name)..."
    Get-Content $Script.FullName | & $MySqlPath -h 127.0.0.1 -u root -p"$PlainPassword" -D lifestyle_products
}

Write-Host "Creating indexes..." -ForegroundColor Green
Get-Content "db/12_indexes.sql" | & $MySqlPath -h 127.0.0.1 -u root -p"$PlainPassword" -D lifestyle_products

Write-Host "Seeding sample data..." -ForegroundColor Green
Get-Content "db/13_sample_data.sql" | & $MySqlPath -h 127.0.0.1 -u root -p"$PlainPassword" -D lifestyle_products

Write-Host "Creating views, stored procedures, and triggers..." -ForegroundColor Green
Get-Content "db/15_views_procedures_triggers.sql" | & $MySqlPath -h 127.0.0.1 -u root -p"$PlainPassword" -D lifestyle_products

Write-Host "Database initialization completed successfully!" -ForegroundColor Green
