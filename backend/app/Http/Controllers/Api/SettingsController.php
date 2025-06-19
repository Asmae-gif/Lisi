<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\UpdateSettingsRequest;

class SettingsController extends Controller
{
    public function __construct()
    {
        \Log::info('SettingsController constructed');
    }

    /**
     * Liste les settings de la page
     * GET /api/pages/{page}/settings
     */
    public function index(string $page)
    {
        \Log::info('SettingsController index method called', ['page' => $page]);
        \Log::info('Récupération des settings', ['page' => $page]);
        
        $settings = Setting::forPage($page);
        \Log::info('Settings récupérés', ['settings' => $settings]);
        
        return response()->json($settings);
    }

    /**
     * Update the specified settings.
     * PUT /api/pages/{page}/settings
     */
    public function update(UpdateSettingsRequest $request, string $page)
    {
        return $this->updateSettings($request, $page);
    }

    /**
     * Update settings without validation (for testing)
     * POST /api/pages/{page}/settings
     */
    public function updatePost(Request $request, string $page)
    {
        return $this->updateSettings($request, $page);
    }

    /**
     * Common update logic
     */
    private function updateSettings($request, string $page)
    {
        try {
            \Log::info('Début de la mise à jour des settings', ['page' => $page]);
            \Log::info('Données reçues', ['all' => $request->all()]);
            \Log::info('Fichiers reçus', ['files' => $request->allFiles()]);
            \Log::info('Content-Type', ['content_type' => $request->header('Content-Type')]);
            \Log::info('Méthode HTTP', ['method' => $request->method()]);
            \Log::info('URL', ['url' => $request->url()]);
            
            // Log des données brutes pour debug
            \Log::info('Contenu brut (premiers 1000 caractères)', ['raw_content' => substr($request->getContent(), 0, 1000)]);
            \Log::info('$_POST', ['post' => $_POST]);
            \Log::info('$_FILES', ['files' => $_FILES]);
            
            DB::beginTransaction();
            
            $settings = [];
            $allData = $request->all();
            
            // Si les données sont vides, essayer de récupérer depuis $_POST
            if (empty($allData) && !empty($_POST)) {
                $allData = $_POST;
                \Log::info('Données récupérées depuis $_POST', ['data' => $allData]);
            }
            
            // Si toujours vide, essayer de parser manuellement
            if (empty($allData)) {
                $allData = $this->parseMultipartData($request);
                \Log::info('Données parsées manuellement', ['data' => $allData]);
            }
            
            // Traiter les données
            foreach ($allData as $key => $value) {
                // Ignorer les champs spéciaux
                if ($key === 'page' || $key === '_token' || $key === '_method') {
                    continue;
                }
                
                // Nettoyer la valeur si elle contient du multipart form data
                $cleanValue = $this->cleanMultipartValue($value);
                
                \Log::info('Traitement du champ', ['key' => $key, 'original_value' => is_array($value) ? 'ARRAY' : $value, 'clean_value' => $cleanValue]);
                
                // Vérifier si c'est un fichier
                if ($request->hasFile($key)) {
                    $file = $request->file($key);
                    \Log::info('Fichier détecté via hasFile', ['key' => $key, 'file' => $file]);
                    
                    // Supprimer l'ancienne image si elle existe
                    $oldSetting = Setting::where([
                        'page' => $page,
                        'key' => $key
                    ])->first();
                    
                    if ($oldSetting && $oldSetting->value && Storage::disk('public')->exists($oldSetting->value)) {
                        Storage::disk('public')->delete($oldSetting->value);
                    }
                    
                    // Stocker le nouveau fichier
                    $path = $file->store('settings', 'public');
                    
                    $settings[] = [
                        'page' => $page,
                        'key' => $key,
                        'value' => $path
                    ];
                    
                    \Log::info('Fichier traité', ['key' => $key, 'path' => $path]);
                } elseif (isset($_FILES[$key]) && $_FILES[$key]['error'] === 0) {
                    // Essayer de traiter le fichier depuis $_FILES
                    $fileInfo = $_FILES[$key];
                    \Log::info('Fichier détecté via $_FILES', ['key' => $key, 'file' => $fileInfo]);
                    
                    // Supprimer l'ancienne image si elle existe
                    $oldSetting = Setting::where([
                        'page' => $page,
                        'key' => $key
                    ])->first();
                    
                    if ($oldSetting && $oldSetting->value && Storage::disk('public')->exists($oldSetting->value)) {
                        Storage::disk('public')->delete($oldSetting->value);
                    }
                    
                    // Copier le fichier temporaire vers le stockage
                    $path = Storage::disk('public')->putFileAs('settings', $fileInfo['tmp_name'], $fileInfo['name']);
                    
                    $settings[] = [
                        'page' => $page,
                        'key' => $key,
                        'value' => $path
                    ];
                    
                    \Log::info('Fichier traité via $_FILES', ['key' => $key, 'path' => $path]);
                } else {
                    // C'est une valeur texte
                    $settings[] = [
                        'page' => $page,
                        'key' => $key,
                        'value' => $cleanValue
                    ];
                    
                    \Log::info('Valeur texte traitée', ['key' => $key, 'clean_value' => $cleanValue]);
                }
            }
            
            \Log::info('Settings à mettre à jour', ['settings' => $settings]);
            
            // Mettre à jour ou créer les entrées
            foreach ($settings as $setting) {
                $result = Setting::updateOrCreate(
                    [
                        'page' => $setting['page'],
                        'key' => $setting['key']
                    ],
                    [
                        'value' => $setting['value']
                    ]
                );
                \Log::info('Setting sauvegardé', ['setting' => $result->toArray()]);
            }
            
            DB::commit();
            \Log::info('Transaction commitée avec succès');
            
            // Récupérer les settings mis à jour
            $updatedSettings = Setting::forPage($page);
            \Log::info('Settings mis à jour', ['settings' => $updatedSettings]);
            
            return response()->json([
                'status' => 'success',
                'message' => 'Settings updated successfully',
                'data' => $updatedSettings
            ]);
            
        } catch (\Exception $e) {
            \Log::error('Erreur lors de la mise à jour des settings', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Error updating settings: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Parse multipart form data manually
     */
    private function parseMultipartData($request)
    {
        $contentType = $request->header('Content-Type');
        $rawContent = $request->getContent();
        
        \Log::info('Parsing multipart data', ['content_type' => $contentType]);
        
        // Extraire le boundary
        if (!preg_match('/boundary=([^;]+)/', $contentType, $matches)) {
            \Log::info('No boundary found in content type');
            return [];
        }
        
        $boundary = '--' . trim($matches[1]);
        \Log::info('Boundary found', ['boundary' => $boundary]);
        
        // Diviser le contenu par le boundary
        $parts = explode($boundary, $rawContent);
        \Log::info('Parts count', ['count' => count($parts)]);
        
        $data = [];
        
        foreach ($parts as $index => $part) {
            $part = trim($part);
            if (empty($part) || $part === '--') {
                continue;
            }
            
            \Log::info('Processing part', ['index' => $index, 'part_preview' => substr($part, 0, 200)]);
            
            // Extraire le nom du champ
            if (preg_match('/name="([^"]+)"/', $part, $matches)) {
                $fieldName = $matches[1];
                \Log::info('Field name found', ['field_name' => $fieldName]);
                
                // Vérifier si c'est un fichier
                $isFile = strpos($part, 'filename=') !== false;
                
                if (!$isFile) {
                    // Pour les valeurs textes - nouvelle méthode
                    $lines = explode("\r\n", $part);
                    $value = '';
                    $foundEmptyLine = false;
                    
                    foreach ($lines as $line) {
                        if ($foundEmptyLine) {
                            $value .= $line . "\r\n";
                        } elseif (trim($line) === '') {
                            $foundEmptyLine = true;
                        }
                    }
                    
                    // Nettoyer la valeur
                    $value = trim($value);
                    $value = rtrim($value, "\r\n");
                    
                    // Vérifier que la valeur ne contient pas de headers
                    if (!empty($value) && strpos($value, 'Content-Disposition') === false && strpos($value, 'Content-Type') === false) {
                        $data[$fieldName] = $value;
                        \Log::info('Value extracted successfully', ['field' => $fieldName, 'value' => $value]);
                    } else {
                        \Log::info('Value ignored', ['field' => $fieldName, 'reason' => 'contains_headers_or_empty', 'value' => $value]);
                    }
                } else {
                    \Log::info('File field found', ['field' => $fieldName]);
                }
            } else {
                \Log::info('No field name found in part', ['part_preview' => substr($part, 0, 100)]);
            }
        }
        
        \Log::info('Parsed data result', ['data' => $data]);
        return $data;
    }

    /**
     * Clean raw multipart data from field values
     */
    private function cleanMultipartValue($value)
    {
        // Si la valeur contient du multipart form data, extraire la vraie valeur
        if (strpos($value, 'Content-Disposition: form-data') !== false) {
            // Extraire la valeur après les headers
            $lines = explode("\r\n", $value);
            $cleanValue = '';
            $foundEmptyLine = false;
            
            foreach ($lines as $line) {
                if ($foundEmptyLine) {
                    $cleanValue .= $line . "\r\n";
                } elseif (trim($line) === '') {
                    $foundEmptyLine = true;
                }
            }
            
            $cleanValue = trim($cleanValue);
            $cleanValue = rtrim($cleanValue, "\r\n");
            
            // Vérifier que la valeur ne contient pas de headers
            if (strpos($cleanValue, 'Content-Disposition') === false && strpos($cleanValue, 'Content-Type') === false) {
                return $cleanValue;
            }
        }
        
        return $value;
    }
}