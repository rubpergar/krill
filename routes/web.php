<?php

use App\Enums\TipoNecesidad;
use App\Http\Controllers\PublicLeadController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('formulario', [
        'tiposNecesidad' => TipoNecesidad::cases(),
    ]);
});

Route::post('/', PublicLeadController::class);
