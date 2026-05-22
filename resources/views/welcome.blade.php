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
                    <p class="text-xs text-on-surface-variant">Formulario de captación y panel de seguimiento</p>
                </div>
            </div>

            <div class="hidden items-center gap-6 md:flex">
                <a href="/" class="text-sm font-medium text-on-surface-variant transition-colors duration-200 hover:text-primary">Formulario</a>
                <a href="/admin/login" class="text-sm font-medium text-on-surface-variant transition-colors duration-200 hover:text-primary">Login</a>
            </div>

            <a href="/" class="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-on-primary shadow-sm transition-colors duration-200 hover:bg-surface-tint focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2">
                Abrir formulario
            </a>
        </div>
    </nav>

    <main class="mx-auto grid w-full max-w-[1280px] flex-1 gap-10 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-12 lg:px-8 lg:py-14">
        <section class="flex flex-col gap-6 lg:pr-6">
            <div class="inline-flex w-fit items-center gap-2 rounded-full border border-outline-variant bg-surface-container-low px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-on-surface-variant">
                <span class="h-2 w-2 rounded-full bg-primary"></span>
                PrawnForms platform
            </div>

            <div class="space-y-4">
                <h1 class="max-w-xl text-4xl font-bold tracking-[-0.02em] text-on-surface sm:text-5xl lg:text-6xl lg:leading-[1.05]">
                    Capture and manage leads with precision
                </h1>
                <p class="max-w-xl text-lg leading-7 text-on-surface-variant sm:text-xl sm:leading-8">
                    Centraliza solicitudes, organiza el seguimiento interno y ofrece una experiencia limpia para visitantes y equipo.
                </p>
            </div>

            <div class="grid gap-4 sm:grid-cols-3">
                <article class="rounded-xl border border-outline-variant bg-surface-container-lowest p-4 shadow-sm">
                    <h2 class="text-sm font-semibold text-on-surface">Landing pública</h2>
                    <p class="mt-1 text-sm leading-6 text-on-surface-variant">Formulario optimizado para captación de solicitudes.</p>
                </article>
                <article class="rounded-xl border border-outline-variant bg-surface-container-lowest p-4 shadow-sm">
                    <h2 class="text-sm font-semibold text-on-surface">Panel interno</h2>
                    <p class="mt-1 text-sm leading-6 text-on-surface-variant">Seguimiento de leads con Filament y filtros.</p>
                </article>
                <article class="rounded-xl border border-outline-variant bg-surface-container-lowest p-4 shadow-sm">
                    <h2 class="text-sm font-semibold text-on-surface">Base preparada</h2>
                    <p class="mt-1 text-sm leading-6 text-on-surface-variant">Estados, auditoría y crecimiento operativo.</p>
                </article>
            </div>
        </section>

        <section class="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-md sm:p-8">
            <div class="mb-6 flex items-start justify-between gap-4">
                <div>
                    <p class="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Access point</p>
                    <h2 class="mt-2 text-2xl font-semibold tracking-[-0.01em] text-on-surface">Entradas principales</h2>
                </div>
                <div class="hidden h-11 w-11 items-center justify-center rounded-full bg-surface-container-low text-primary sm:flex">
                    <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="m13 5 7 7-7 7" />
                    </svg>
                </div>
            </div>

            <div class="grid gap-4">
                <a href="/" class="group flex items-center justify-between rounded-lg border border-outline-variant bg-surface-container-low p-4 transition-colors duration-200 hover:border-primary hover:bg-surface-container">
                    <div>
                        <p class="text-sm font-semibold text-on-surface">Formulario público</p>
                        <p class="mt-1 text-sm text-on-surface-variant">Abrir la vista principal para capturar solicitudes.</p>
                    </div>
                    <span class="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-on-primary">Ir</span>
                </a>

                <a href="/admin/login" class="group flex items-center justify-between rounded-lg border border-outline-variant bg-surface-container-low p-4 transition-colors duration-200 hover:border-primary hover:bg-surface-container">
                    <div>
                        <p class="text-sm font-semibold text-on-surface">Panel de administración</p>
                        <p class="mt-1 text-sm text-on-surface-variant">Acceso al panel Filament para seguimiento interno.</p>
                    </div>
                    <span class="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-on-primary">Login</span>
                </a>
            </div>
        </section>
    </main>

    <footer class="border-t border-outline-variant bg-surface-container-highest">
        <div class="mx-auto flex w-full max-w-[1280px] flex-col gap-4 px-4 py-6 text-sm text-on-surface-variant sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <p>© PrawnForms. Interfaz coherente para captación y seguimiento.</p>
            <a href="/admin/login" class="font-medium text-primary transition-colors duration-200 hover:text-surface-tint">Acceso interno</a>
        </div>
    </footer>
</body>
</html>
