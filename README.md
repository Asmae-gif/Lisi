# Portail Web Dynamique du LISI (Laboratoire LISI - FSSM)
Le projet utilise une architecture **frontend-backend** :
- Backend : Laravel 11 (API REST avec Sanctum)
- Frontend : React.js + TypeScript (avec Tailwind CSS)
- Base de données : MySQL

## Installation:
- git clone https://github.com/Asmae-gif/Lisi.git
- cd Lisi

## Installer les dépendances:
### Backend (Laravel)
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
php artisan serve

### Frontend (React + Vite): 
cd frontend
npm install
npm run dev

### Création d’un administrateur:
php artisan user:make-admin email@example.com --password=motdepasse
