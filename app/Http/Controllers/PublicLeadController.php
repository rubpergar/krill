<?php

namespace App\Http\Controllers;

use App\Enums\LeadStatus;
use App\Enums\TipoNecesidad;
use App\Models\Lead;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\Rule;

class PublicLeadController extends Controller
{
    public function __invoke(Request $request): RedirectResponse
    {
        $rateLimitKey = 'public-form:'.$request->ip();

        if (RateLimiter::tooManyAttempts($rateLimitKey, 5)) {
            abort(429);
        }

        RateLimiter::hit($rateLimitKey, 60);

        if ($request->filled('website_url')) {
            return redirect('/gracias');
        }

        $validated = $request->validate([
            'nombre' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'telefono' => ['required', 'string', 'max:255'],
            'empresa' => ['required', 'string', 'max:255'],
            'tipo_necesidad' => ['required', Rule::enum(TipoNecesidad::class)],
            'mensaje' => ['required', 'string'],
            'consentimiento' => ['required', 'accepted'],
        ]);

        Lead::create([
            'nombre' => $validated['nombre'],
            'email' => $validated['email'],
            'telefono' => $validated['telefono'],
            'empresa' => $validated['empresa'],
            'tipo_necesidad' => $validated['tipo_necesidad'],
            'mensaje' => $validated['mensaje'],
            'estado' => LeadStatus::Nuevo,
            'origen' => 'web',
            'ip_origen' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'consentimiento_aceptado' => true,
            'consentimiento_fecha' => now(),
        ]);

        return redirect('/gracias');
    }
}
