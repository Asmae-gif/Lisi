@echo off
echo ========================================
echo    Démarrage du serveur Laravel LISI
echo ========================================

echo.
echo 1. Vérification de la configuration...
if not exist ".env" (
    echo ❌ Fichier .env manquant !
    echo Veuillez copier .env.example vers .env et configurer la base de données
    pause
    exit /b 1
)

echo ✅ Fichier .env trouvé

echo.
echo 2. Nettoyage du cache...
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

echo.
echo 3. Diagnostic de la base de données...
php fix-database.php

echo.
echo 4. Démarrage du serveur...
echo Serveur accessible sur: http://localhost:8000
echo API accessible sur: http://localhost:8000/api
echo.
echo Appuyez sur Ctrl+C pour arrêter le serveur
echo.

php artisan serve --host=0.0.0.0 --port=8000

pause 