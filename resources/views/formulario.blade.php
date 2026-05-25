<!DOCTYPE html>
<html lang="es" class="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PrawnForms - Capture and Manage Leads with Precision</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="bg-background text-on-background font-sans antialiased min-h-screen flex flex-col">
    <nav class="sticky top-0 z-40 border-b border-outline-variant bg-surface/95 backdrop-blur">
        <div class="mx-auto flex w-full max-w-[1280px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <div class="flex items-center gap-3">
                <div class="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-on-primary shadow-sm">
                    <span class="text-sm font-bold leading-none">P</span>
                </div>
                <div>
                    <p class="text-sm font-semibold tracking-tight text-primary sm:text-base">PrawnForms</p>
                    <p class="text-xs text-on-surface-variant">Formulario público y panel de seguimiento</p>
                </div>
            </div>

            <div class="hidden items-center gap-6 md:flex">
                <a href="#formulario" class="text-sm font-medium text-on-surface-variant transition-colors duration-200 hover:text-primary">Formulario</a>
                <a href="#propuesta" class="text-sm font-medium text-on-surface-variant transition-colors duration-200 hover:text-primary">Propuesta</a>
                <a href="/admin/login" class="text-sm font-medium text-on-surface-variant transition-colors duration-200 hover:text-primary">Login</a>
            </div>

            <a href="/admin/login" class="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-on-primary shadow-sm transition-colors duration-200 hover:bg-surface-tint focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2">
                Panel
            </a>
        </div>
    </nav>

    <main class="mx-auto grid w-full max-w-[1280px] flex-1 gap-10 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-12 lg:px-8 lg:py-14">
        <section class="flex flex-col gap-6 lg:pr-6">
            <div class="inline-flex w-fit items-center gap-2 rounded-full border border-outline-variant bg-surface-container-low px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-on-surface-variant">
                <span class="h-2 w-2 rounded-full bg-primary"></span>
                Lead capture system
            </div>

            <div class="space-y-4">
                <h1 class="max-w-xl text-4xl font-bold tracking-[-0.02em] text-on-surface sm:text-5xl lg:text-6xl lg:leading-[1.05]">
                    Capture and manage leads with precision
                </h1>
                <p class="max-w-xl text-lg leading-7 text-on-surface-variant sm:text-xl sm:leading-8">
                    Centraliza los envíos del formulario público en un panel profesional para seguir solicitudes, priorizar oportunidades y mantener el control operativo.
                </p>
            </div>

            <div id="propuesta" class="grid gap-4 sm:grid-cols-3">
                <article class="rounded-xl border border-outline-variant bg-surface-container-lowest p-4 shadow-sm">
                    <div class="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M20 7L10 17l-5-5" />
                        </svg>
                    </div>
                    <h2 class="text-sm font-semibold text-on-surface">Captura limpia</h2>
                    <p class="mt-1 text-sm leading-6 text-on-surface-variant">Entrada pública clara, sin fricción y con validación visible.</p>
                </article>

                <article class="rounded-xl border border-outline-variant bg-surface-container-lowest p-4 shadow-sm">
                    <div class="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6l4 2" />
                            <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-9-9" />
                        </svg>
                    </div>
                    <h2 class="text-sm font-semibold text-on-surface">Seguimiento</h2>
                    <p class="mt-1 text-sm leading-6 text-on-surface-variant">Panel interno para revisar solicitudes y filtrarlas con rapidez.</p>
                </article>

                <article class="rounded-xl border border-outline-variant bg-surface-container-lowest p-4 shadow-sm">
                    <div class="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v18" />
                            <path stroke-linecap="round" stroke-linejoin="round" d="M7 8h10" />
                            <path stroke-linecap="round" stroke-linejoin="round" d="M7 16h10" />
                        </svg>
                    </div>
                    <h2 class="text-sm font-semibold text-on-surface">Trazabilidad</h2>
                    <p class="mt-1 text-sm leading-6 text-on-surface-variant">Base preparada para estados, auditoría y gestión futura.</p>
                </article>
            </div>
        </section>

        <section id="formulario" class="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-md sm:p-8">
            <div class="mb-6 flex items-start justify-between gap-4">
                <div>
                    <p class="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Request a consultation</p>
                    <h2 class="mt-2 text-2xl font-semibold tracking-[-0.01em] text-on-surface">Formulario de contacto</h2>
                </div>
                <div class="hidden h-11 w-11 items-center justify-center rounded-full bg-surface-container-low text-primary sm:flex">
                    <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4 12h16" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M14 6l6 6-6 6" />
                    </svg>
                </div>
            </div>

            @if (session('status'))
                <div class="mb-6 rounded-lg border border-success/20 bg-success/10 p-4 text-sm text-success">
                    {{ session('status') }}
                </div>
            @endif

            @if ($errors->any())
                <div class="mb-6 rounded-lg border border-danger/20 bg-danger/10 p-4 text-sm text-danger">
                    Revisa los campos del formulario.
                </div>
            @endif

            <form method="POST" action="/" class="space-y-4">
                @csrf

                <div class="hidden">
                    <input type="text" name="website_url" tabindex="-1" autocomplete="off">
                </div>

                <div class="grid gap-4 sm:grid-cols-2">
                    <div class="flex flex-col gap-1.5">
                        <label for="nombre" class="text-sm font-medium text-on-surface">Nombre</label>
                        <input type="text" name="nombre" id="nombre" value="{{ old('nombre') }}" required
                            class="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-sm text-on-surface shadow-sm transition duration-200 ease-in-out placeholder:text-on-surface-variant focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none">
                        @error('nombre')
                            <p class="text-sm text-danger">{{ $message }}</p>
                        @enderror
                    </div>

                    <div class="flex flex-col gap-1.5">
                        <label for="empresa" class="text-sm font-medium text-on-surface">Empresa</label>
                        <input type="text" name="empresa" id="empresa" value="{{ old('empresa') }}" required
                            class="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-sm text-on-surface shadow-sm transition duration-200 ease-in-out placeholder:text-on-surface-variant focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none">
                        @error('empresa')
                            <p class="text-sm text-danger">{{ $message }}</p>
                        @enderror
                    </div>
                </div>

                <div class="grid gap-4 sm:grid-cols-2">
                    <div class="flex flex-col gap-1.5">
                        <label for="email" class="text-sm font-medium text-on-surface">Email</label>
                        <input type="email" name="email" id="email" value="{{ old('email') }}" required
                            class="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-sm text-on-surface shadow-sm transition duration-200 ease-in-out placeholder:text-on-surface-variant focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none">
                        @error('email')
                            <p class="text-sm text-danger">{{ $message }}</p>
                        @enderror
                    </div>

                    <div class="flex flex-col gap-1.5">
                        <label for="telefono" class="text-sm font-medium text-on-surface">Teléfono</label>
                        <input type="tel" name="telefono" id="telefono" value="{{ old('telefono') }}" required
                            class="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-sm text-on-surface shadow-sm transition duration-200 ease-in-out placeholder:text-on-surface-variant focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none">
                        @error('telefono')
                            <p class="text-sm text-danger">{{ $message }}</p>
                        @enderror
                    </div>
                </div>

                <div class="flex flex-col gap-1.5">
                    <label for="tipo_necesidad" class="text-sm font-medium text-on-surface">Tipo de necesidad</label>
                    <select name="tipo_necesidad" id="tipo_necesidad" required
                        class="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-sm text-on-surface shadow-sm transition duration-200 ease-in-out focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none">
                        <option value="">Seleccione...</option>
                        @foreach ($tiposNecesidad as $tipoNecesidad)
                            <option value="{{ $tipoNecesidad->value }}" @selected(old('tipo_necesidad') === $tipoNecesidad->value)>
                                {{ $tipoNecesidad->value }}
                            </option>
                        @endforeach
                    </select>
                    @error('tipo_necesidad')
                        <p class="text-sm text-danger">{{ $message }}</p>
                    @enderror
                </div>

                <div class="flex flex-col gap-1.5">
                    <label for="mensaje" class="text-sm font-medium text-on-surface">Mensaje</label>
                    <textarea name="mensaje" id="mensaje" rows="5" required
                        class="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-sm text-on-surface shadow-sm transition duration-200 ease-in-out placeholder:text-on-surface-variant focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none">{{ old('mensaje') }}</textarea>
                    @error('mensaje')
                        <p class="text-sm text-danger">{{ $message }}</p>
                    @enderror
                </div>

                <div class="flex items-start gap-3 rounded-lg border border-outline-variant bg-surface-container-low p-4">
                    <input type="checkbox" name="consentimiento" id="consentimiento" required
                        value="1" @checked(old('consentimiento'))
                        class="mt-0.5 h-4 w-4 shrink-0 rounded border-outline-variant text-primary shadow-sm transition duration-200 ease-in-out focus:ring-2 focus:ring-primary/20 focus:outline-none focus:ring-offset-0">
                    <label for="consentimiento" class="text-sm leading-6 text-on-surface-variant">
                        He leído y acepto la <a href="/privacidad" class="font-medium text-primary underline underline-offset-2 hover:text-surface-tint">política de privacidad</a>.
                    </label>
                </div>
                @error('consentimiento')
                    <p class="-mt-2 text-sm text-danger">{{ $message }}</p>
                @enderror

                <div class="pt-2">
                    <button type="submit"
                        class="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-on-primary shadow-sm transition-colors duration-200 hover:bg-surface-tint focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 active:bg-primary/80">
                        Enviar solicitud
                        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14" />
                            <path stroke-linecap="round" stroke-linejoin="round" d="m13 5 7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </form>

            <div class="mt-6 flex items-center justify-between gap-4 border-t border-outline-variant pt-5 text-sm">
                <p class="text-on-surface-variant">Acceso interno disponible para el equipo.</p>
                <a href="/admin/login" class="font-medium text-primary transition-colors duration-200 hover:text-surface-tint focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 rounded">
                    Panel de administración
                </a>
            </div>
        </section>
    </main>

    <footer class="border-t border-outline-variant bg-surface-container-highest">
        <div class="mx-auto flex w-full max-w-[1280px] flex-col gap-4 px-4 py-6 text-sm text-on-surface-variant sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <p>© PrawnForms. Sistema de captación y seguimiento de solicitudes.</p>
            <div class="flex flex-wrap items-center gap-4">
                <a href="/admin/login" class="transition-colors duration-200 hover:text-primary">Panel</a>
                <span class="text-outline">•</span>
                <span>Privacidad y seguridad integradas</span>
            </div>
        </div>
    </footer>
</body>
</html>
