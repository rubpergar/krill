<?php

use App\Enums\TipoNecesidad;
use App\Http\Controllers\PublicLeadController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('formulario', [
        'tiposNecesidad' => TipoNecesidad::cases(),
    ]);
});

Route::get('/gracias', function () {
    return view('confirmacion');
});

Route::get('/privacidad', function () {
    return view('privacidad');
});

Route::post('/', PublicLeadController::class);
