# Portail du Laboratoire de Recherche LISI

## 🔍 Description

Ce projet est un portail web dynamique développé pour le laboratoire LISI (FSSM - UCA).  
Il permet de présenter les axes de recherche, les équipes, les membres (enseignants, doctorants...), les publications, et de gérer les contacts.

## 🚀 Technologies utilisées

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.dev/)
- Backend : [Laravel 11](https://laravel.com/) + Sanctum pour l'authentification (non inclus ici)

## 📁 Structure du projet

```bash
.
├── public/              # Contient les images publiques
├── src/                 # Contient le code source
│   ├── components/      # Composants réutilisables React
│   ├── pages/           # Pages principales du site
│   ├── App.tsx          # Point d'entrée React
│   └── main.tsx         # Initialisation React + DOM
├── tailwind.config.ts   # Configuration Tailwind (couleurs personnalisées)
├── vite.config.ts       # Configuration Vite (alias, serveur, etc.)
├── tsconfig.json        # Configuration TypeScript
└── README.md            # Ce fichier
