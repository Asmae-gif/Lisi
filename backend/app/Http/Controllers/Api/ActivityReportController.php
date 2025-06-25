<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityReport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ActivityReportController extends Controller
{
    /**
     * Display a listing of activity reports (public)
     */
    public function index()
    {
        $reports = ActivityReport::select(['id', 'report_date', 'pdf_path', 'created_at', 'updated_at'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($reports);
    }

    /**
     * Store a newly created activity report (admin only)
     */
    public function store(Request $request)
    {
        $user = $request->user();
        if (!$user || !$user->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'pdf_path' => 'required|file|mimes:pdf|max:10240',
            'report_date' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $pdfPath = null;
        // Vérifie d'abord 'pdf_path', puis 'pdf' comme fallback
        if ($request->hasFile('pdf_path')) {
            $pdfPath = $request->file('pdf_path')->store('activity-reports', 'public');
        } elseif ($request->hasFile('pdf')) {
            $pdfPath = $request->file('pdf')->store('activity-reports', 'public');
        }

        $report = ActivityReport::create([
            'pdf_path' => $pdfPath,
            'report_date' => $request->report_date,
        ]);

        return response()->json($report, 201);
    }

    /**
     * Display the specified activity report (view or download PDF)
     */
    public function show(ActivityReport $activityReport, Request $request)
    {
        if (!$activityReport->pdf_path || !Storage::disk('public')->exists($activityReport->pdf_path)) {
            return response()->json(['message' => 'PDF not found'], 404);
        }

        $filePath = Storage::disk('public')->path($activityReport->pdf_path);
        
        // Si le paramètre download=1 est présent, forcer le téléchargement
        if ($request->query('download') == '1') {
            return response()->download($filePath);
        }
        
        // Sinon, afficher le PDF dans le navigateur
        return response()->file($filePath, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="rapport-activite-' . date('Y', strtotime($activityReport->report_date)) . '.pdf"'
        ]);
    }

    /**
     * Update the specified activity report (admin only)
     */
    public function update(Request $request, ActivityReport $activityReport)
    {
        $user = $request->user();
        if (!$user || !$user->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'pdf_path' => 'sometimes|file|mimes:pdf|max:10240',
            'report_date' => 'sometimes|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $updateData = [];

        if ($request->has('report_date')) {
            $updateData['report_date'] = $request->report_date;
        }

        if ($request->hasFile('pdf_path') || $request->hasFile('pdf')) {
            // Delete old PDF if exists
            if ($activityReport->pdf_path && Storage::disk('public')->exists($activityReport->pdf_path)) {
                Storage::disk('public')->delete($activityReport->pdf_path);
            }
            
            if ($request->hasFile('pdf_path')) {
                $updateData['pdf_path'] = $request->file('pdf_path')->store('activity-reports', 'public');
            } elseif ($request->hasFile('pdf')) {
                $updateData['pdf_path'] = $request->file('pdf')->store('activity-reports', 'public');
            }
        }

        $activityReport->update($updateData);

        return response()->json($activityReport);
    }

    /**
     * Remove the specified activity report (admin only)
     */
    public function destroy(Request $request, ActivityReport $activityReport)
    {
        $user = $request->user();
        if (!$user || !$user->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Delete PDF file if exists
        if ($activityReport->pdf_path && Storage::disk('public')->exists($activityReport->pdf_path)) {
            Storage::disk('public')->delete($activityReport->pdf_path);
        }

        $activityReport->delete();

        return response()->json(['message' => 'Activity report deleted successfully']);
    }
}