<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\File;

class FileController extends Controller
{
    public function download($id)
{
    $file = File::findOrFail($id); // Adjust model name if necessary

    $filePath = storage_path('app\\public\\'.$file->file_path); // Adjust file path
    // return response()->json([$filePath,file_exists($filePath)]);
    if (!file_exists($filePath)) {
        return response()->json(['error' => 'File not found'], 404);
    }

    return response()->download($filePath);
}
}