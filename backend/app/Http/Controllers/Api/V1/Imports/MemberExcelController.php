<?php

namespace App\Http\Controllers\Api\V1\Imports;

use App\Http\Controllers\Controller;
use App\Imports\MemberImport;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class MemberExcelController extends Controller
{
    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv|max:2048',
        ]);

        try {
            // Kunin ang ID ng kasalukuyang naka-login na user
            $userId = $request->user()->id ?? 1;

            Excel::import(new MemberImport($userId), $request->file('file'));

            return response()->json([
                'status' => 'success',
                'message' => 'Members imported successfully from Excel!',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to import excel: ' . $e->getMessage(),
            ], 500);
        }
    }
}
