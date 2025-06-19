<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Contact;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        Contact::create($data);
        return response()->json(['message' => 'Message envoyé avec succès.']);
    }

    public function index(Request $request)
    {
        $messages = Contact::orderBy('created_at', 'desc')
            ->paginate($request->per_page ?? 10);

        return response()->json($messages);
    }

    public function toggleRead($id)
{
    $message = Contact::findOrFail($id);
    $message->is_read = !$message->is_read;
    $message->save();

    return response()->json([
        'message' => 'Statut mis à jour.',
        'is_read' => $message->is_read,
        'id' => $message->id
    ]);
}

    public function destroy($id)
    {
        Contact::destroy($id);
        return response()->json(['message' => 'Message supprimé.']);
    }
}
