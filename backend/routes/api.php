<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Session\Middleware\StartSession;

// Models
use App\Models\Membre;
use App\Models\Publication;
use App\Models\Projet;
use App\Models\Project;

// Auth Controllers
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\SocialAuthController;
use App\Http\Controllers\Auth\VerifyEmailController;

// API Controllers
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\MembreController;
use App\Http\Controllers\Api\AdminMembreController;
use App\Http\Controllers\Api\AdminUserController;
use App\Http\Controllers\Api\PublicationController;
use App\Http\Controllers\Api\ProjetController;
use App\Http\Controllers\Api\ThemeRechercheController;
use App\Http\Controllers\Api\AxeController;
use App\Http\Controllers\Api\AxeMembreController;
use App\Http\Controllers\Api\SettingsController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\GallerieController;
use App\Http\Controllers\Api\PartenaireController;
use App\Http\Controllers\Api\MotDirecteurController;
use App\Http\Controllers\Api\HistoireController;
use App\Http\Controllers\Api\ProjetFinanceController;
use App\Http\Controllers\Api\ProjetIncubeController;
use App\Http\Controllers\Api\PrixDistinctionController;

// Autres Controllers
use App\Http\Controllers\Api\ProjectController;


// Routes d'authentification sociale
Route::get('auth/google/redirect', [SocialAuthController::class, 'redirectToGoogle']);
Route::get('auth/google/callback', [SocialAuthController::class, 'handleGoogleCallback']);


// Route pour le cookie CSRF
Route::get('/sanctum/csrf-cookie', function() {
    return response()->json(['message' => 'CSRF cookie set']);
});

// Route pour gérer les requêtes OPTIONS (preflight CORS)
Route::options('{any}', function () {
    return response('', 200)
        ->header('Access-Control-Allow-Origin', 'http://localhost:5173')
        ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-CSRF-TOKEN, X-XSRF-TOKEN')
        ->header('Access-Control-Allow-Credentials', 'true');
})->where('any', '.*');

// Routes d'authentification publiques (avec session)
Route::middleware([StartSession::class, 'throttle:6,1'])->group(function () {
    Route::post('/login', [AuthenticatedSessionController::class, 'store']);
    Route::post('/register', [RegisteredUserController::class, 'store']);
    Route::post('/forgot-password', [PasswordResetLinkController::class, 'store'])->name('password.email');
    Route::post('/reset-password', [NewPasswordController::class, 'store'])->name('password.store');
});

// Vérification d'email
Route::get('/verify-email/{id}/{hash}', [VerifyEmailController::class, '__invoke'])
    ->middleware(['signed'])
    ->name('verification.verify');


// Routes publiques pour les axes et équipes
Route::prefix('axes')->group(function () {
    Route::get('/', [AxeController::class, 'index']);               // Liste de tous les axes
    Route::get('/{axe}', [AxeController::class, 'show']);           // Détail d'un axe
    Route::get('/{axe}/membres', [AxeController::class, 'getMembresByPosition']); // Membres d'un axe par position
});

// Routes publiques pour les membres
Route::prefix('membres')->group(function () {
    Route::get('/', [MembreController::class, 'index']);
    Route::get('/{membre}', [MembreController::class, 'showPublic']);
});

// Routes publiques pour les publications
Route::prefix('publications')->group(function () {
    Route::get('/', [PublicationController::class, 'index']);
    Route::get('/{publication}', [PublicationController::class, 'show']);
});

// Routes publiques pour les projets
Route::prefix('projects')->group(function () {
    Route::get('/', [ProjectController::class, 'index']);
    Route::get('/{project}', [ProjectController::class, 'show']);
});

// Routes publiques pour les prix et distinctions
Route::prefix('prix-distinctions')->group(function () {
    Route::get('/', [PrixDistinctionController::class, 'index']);
    Route::post('/', [PrixDistinctionController::class, 'store']);
    Route::get('/{prix_distinction}', [PrixDistinctionController::class, 'show']);
    Route::put('/{prix_distinction}', [PrixDistinctionController::class, 'update']);
    Route::delete('/{prix_distinction}', [PrixDistinctionController::class, 'destroy']);
});

// Routes publiques pour les partenaires
Route::prefix('partenaires')->group(function () {
    Route::get('/', [PartenaireController::class, 'index']);
});

// Autres routes publiques en lecture seule
Route::get('/stats', [DashboardController::class, 'publicStats']);
Route::get('/pages/{page}/settings', [SettingsController::class, 'index']);
Route::get('/membres-comite', [AdminMembreController::class, 'getComite']);

// Routes pour les galeries (publiques)
Route::prefix('galleries')->group(function () {
    Route::get('/', [GallerieController::class, 'getGalleries']); // Toutes les galeries publiques
    Route::get('/entity', [GallerieController::class, 'index']); // Lister les galeries d'une entité
    Route::get('/{id}', [GallerieController::class, 'show']); // Voir une galerie spécifique
});

// Routes publiques pour les paramètres et contact
Route::post('/contact', [ContactController::class, 'store']);


    // Routes protégées (authentification requise)
Route::middleware('auth:sanctum')->group(function () {
    // Route pour obtenir l'utilisateur connecté
    Route::get('/user', function (Request $request) {
        $user = $request->user()->load(['roles', 'membre']);
        return response()->json([
            'user' => $user,
            'type' => $user->roles->pluck('name')->contains('admin') ? 'admin' : 'membre',
        ]);
    });

    // Route de déconnexion
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy']);

    // Routes directes pour /membre (compatibilité frontend)
    Route::prefix('membre')->group(function () {
        Route::get('/', [MembreController::class, 'show']);
        Route::put('/', [MembreController::class, 'update']);
    });

    // Gestion des paramètres (accessible aux utilisateurs authentifiés)
    Route::prefix('pages/{page}/settings')->group(function () {
        Route::post('/', [SettingsController::class, 'updatePost']);
    });

    // Routes pour le mot du directeur (CRUD complet)
    Route::get('/mot-directeur', [MotDirecteurController::class, 'index']);
    Route::post('/mot-directeur', [MotDirecteurController::class, 'store']);
    Route::put('/mot-directeur/{id}', [MotDirecteurController::class, 'update']);
    Route::delete('/mot-directeur/{id}', [MotDirecteurController::class, 'destroy']);

    // Routes pour l'histoire (CRUD complet)
    Route::get('/histoire', [HistoireController::class, 'index']);
    Route::post('/histoire', [HistoireController::class, 'store']);
    Route::put('/histoire/{id}', [HistoireController::class, 'update']);
    Route::delete('/histoire/{id}', [HistoireController::class, 'destroy']);

    // Routes pour les partenaires (CRUD complet)
    Route::get('/partenaires', [PartenaireController::class, 'index']);
    Route::post('/partenaires', [PartenaireController::class, 'store']);
    Route::put('/partenaires/{id}', [PartenaireController::class, 'update']);
    Route::delete('/partenaires/{id}', [PartenaireController::class, 'destroy']);

    // Routes pour les publications (CRUD complet)
    //Route::get('/publications', [PublicationController::class, 'index']);
    Route::post('/publications', [PublicationController::class, 'store']);
    Route::get('/publications/{publication}', [PublicationController::class, 'show']);
    Route::put('/publications/{publication}', [PublicationController::class, 'update']);
    Route::delete('/publications/{publication}', [PublicationController::class, 'destroy']);

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // Membres (routes protégées pour la gestion)
    Route::get('/membres/profile', [MembreController::class, 'profile']);
    Route::put('/membres/profile', [MembreController::class, 'updateProfile']);
    Route::post('/membres', [MembreController::class, 'store']);
    Route::get('/membres/{membre}', [MembreController::class, 'show']);
    Route::put('/membres/{membre}', [MembreController::class, 'update']);
    Route::delete('/membres/{membre}', [MembreController::class, 'destroy']);

    // Projets (CRUD complet)
    Route::apiResource('projets', ProjetController::class);
    Route::apiResource('projects', ProjectController::class);

    // Financements de projets
    Route::apiResource('projet-finances', ProjetFinanceController::class);
    Route::get('/projects/{projectId}/finances', [ProjetFinanceController::class, 'byProject']);

    // Incubations de projets
    Route::apiResource('projet-incubes', ProjetIncubeController::class);
    Route::get('/projects/{projectId}/incubes', [ProjetIncubeController::class, 'byProject']);

    // Routes pour les utilisateurs bloqués
    Route::middleware(['blocked'])->group(function () {
        Route::prefix('membre')->group(function () {
            Route::get('/', [MembreController::class, 'show']);
            Route::put('/', [MembreController::class, 'update']);
        });
    });

    // Routes admin
    Route::middleware(['auth:sanctum', 'role:admin', 'throttle:120,1'])->prefix('admin')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index']);

        // Gestion des membres
        Route::post('/membres', [AdminMembreController::class, 'store']);
        Route::put('/membres/{membre}', [AdminMembreController::class, 'update']);
        Route::delete('/membres/{membre}', [AdminMembreController::class, 'destroy']);
        Route::post('/membres/{membre}/toggle-comite', [AdminMembreController::class, 'toggleComite']);

        // Relations Axe-Membre
        Route::get('/axe-membre', [AxeMembreController::class, 'index']);

        // Gestion des axes et leurs membres
        Route::prefix('axes')->group(function () {
            Route::post('/', [AxeController::class, 'store']);
            Route::get('/{axe}', [AxeController::class, 'show']);
            Route::put('/{axe}', [AxeController::class, 'update']);
            Route::delete('/{axe}', [AxeController::class, 'destroy']);

            // Gestion des membres dans un axe
            Route::get('/{axe}/membres', [AxeController::class, 'getMembresByPosition']);
            Route::post('/{axe}/membres', [AxeController::class, 'addMembre']);
            Route::delete('/{axe}/membres/{membre}', [AxeController::class, 'removeMembre']);
            Route::put('/{axe}/membres/{membre}/position', [AxeController::class, 'updateMembrePosition']);
        });

        // Gestion des utilisateurs
        Route::prefix('users')->group(function () {
            Route::get('/', [AdminUserController::class, 'index']);
            Route::get('/{id}', [AdminUserController::class, 'show']);
            Route::put('/{id}', [AdminUserController::class, 'update']);
            Route::delete('/{id}', [AdminUserController::class, 'destroy']);
            Route::post('/', [UserController::class, 'store']);

            // Routes de gestion des utilisateurs
            Route::post('{user}/approve', [AdminUserController::class, 'approve']);
            Route::post('{user}/reject',  [AdminUserController::class, 'reject']);
            Route::post('{user}/block',   [AdminUserController::class, 'block']);
            Route::post('{user}/unblock', [AdminUserController::class, 'unblock']);
        });

        // Gestion des messages de contact
        Route::prefix('contact')->group(function () {
            Route::get('/messages', [ContactController::class, 'index']);
            Route::patch('/messages/{id}/toggle-read', [ContactController::class, 'toggleRead']);
            Route::delete('/messages/{id}', [ContactController::class, 'destroy']);
        });

        // Gestion des galeries (admin)
        Route::prefix('galleries')->group(function () {
            Route::get('/', [GallerieController::class, 'allGalleries']); // Toutes les galeries
            Route::get('/{id}', [GallerieController::class, 'show']); // Voir une galerie spécifique
            Route::post('/', [GallerieController::class, 'store']); // Créer une galerie
            Route::put('/{id}', [GallerieController::class, 'update']); // Mettre à jour une galerie
            Route::delete('/{id}', [GallerieController::class, 'destroy']); // Supprimer une galerie
        });

        // Gestion des prix et distinctions (admin)
        Route::prefix('prix-distinctions')->group(function () {
            Route::get('/', [PrixDistinctionController::class, 'index']);
            Route::post('/', [PrixDistinctionController::class, 'store']);
            Route::get('/{prix_distinction}', [PrixDistinctionController::class, 'show']);
            Route::put('/{prix_distinction}', [PrixDistinctionController::class, 'update']);
            Route::delete('/{prix_distinction}', [PrixDistinctionController::class, 'destroy']);
            Route::get('/membres/{membreId}/prix-distinctions', [PrixDistinctionController::class, 'byMembre']);
        });

        // Gestion des paramètres (admin)
        Route::middleware(['auth:sanctum','can:manage-settings'])
            ->prefix('pages/{page}/settings')
            ->group(function () {
                Route::get('/', [SettingsController::class, 'index']);
            });
    });

    // Route pour les messages admin
    Route::get('/contacts', function () {
        return App\Models\Contact::latest()->get();
    })->middleware('role:admin');
});