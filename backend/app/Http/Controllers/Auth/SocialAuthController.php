<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Membre;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

class SocialAuthController extends Controller
{
    public function redirectToGoogle()
    {
        return Socialite::driver('google')
                        ->stateless()  // on utilise token/cookie, pas sessions classiques
                        ->redirect();
    }

    public function handleGoogleCallback()
    {
        $googleUser = Socialite::driver('google')->stateless()->user();

        // 1) trouver ou créer l'utilisateur
        $user = Membre::firstOrCreate([
            'google_id' => $googleUser->getId(),
        ], [
            'name'     => $googleUser->getName(),
            'email'    => $googleUser->getEmail(),
            'password' => bcrypt(str()->random()),  // mot de passe aléatoire
        ]);

        // 2) le connecter via Sanctum (cookie-based SPA)
        Auth::login($user, true);

        // 3) rediriger vers le front avec un simple flag
        return redirect(config('app.frontend_url').'?social_login=success');
    }
}
