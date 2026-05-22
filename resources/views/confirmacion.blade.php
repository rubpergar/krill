<!DOCTYPE html>
<html lang="es" class="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PrawnForms - Solicitud recibida</title>
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
                    <p class="text-xs text-on-surface-variant">Solicitud confirmada</p>
                </div>
            </div>

            <a href="/" class="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-on-primary shadow-sm transition-colors duration-200 hover:bg-surface-tint focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2">
                Nuevo envío
            </a>
        </div>
    </nav>

    <main class="mx-auto grid w-full max-w-[1280px] flex-1 place-items-center px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <section class="w-full max-w-3xl rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-md sm:p-8 lg:p-10">
            <div class="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
                <div class="space-y-6">
                    <div class="inline-flex items-center gap-2 rounded-full border border-success/20 bg-success/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-success">
                        <span class="h-2 w-2 rounded-full bg-success"></span>
                        Received
                    </div>

                    <div class="space-y-4">
                        <h1 class="text-4xl font-bold tracking-[-0.02em] text-on-surface sm:text-5xl">
                            Solicitud recibida
                        </h1>
                        <p class="max-w-xl text-lg leading-8 text-on-surface-variant">
                            Gracias por contactarnos. Hemos recibido tu solicitud y nos pondremos en contacto contigo pronto.
                        </p>
                    </div>

                    <div class="flex flex-col gap-3 sm:flex-row">
                        <a href="/"
                            class="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-on-primary shadow-sm transition-colors duration-200 hover:bg-surface-tint focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2">
                            Volver al formulario
                        </a>
                        <a href="/admin/login"
                            class="inline-flex items-center justify-center rounded-lg border border-outline-variant bg-surface-container-low px-6 py-3 text-sm font-semibold text-on-surface transition-colors duration-200 hover:border-primary hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2">
                            Panel de administración
                        </a>
                    </div>
                </div>

                <div class="rounded-xl border border-outline-variant bg-surface-container-low p-6 shadow-sm">
                    <div class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-success/10 text-success">
                        <svg class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>

                    <dl class="mt-6 space-y-4 text-sm">
                        <div class="flex items-center justify-between gap-4 rounded-lg bg-surface-container-lowest px-4 py-3">
                            <dt class="text-on-surface-variant">Estado</dt>
                            <dd class="font-semibold text-success">Confirmado</dd>
                        </div>
                        <div class="flex items-center justify-between gap-4 rounded-lg bg-surface-container-lowest px-4 py-3">
                            <dt class="text-on-surface-variant">Canal</dt>
                            <dd class="font-semibold text-on-surface">Formulario público</dd>
                        </div>
                        <div class="flex items-center justify-between gap-4 rounded-lg bg-surface-container-lowest px-4 py-3">
                            <dt class="text-on-surface-variant">Siguiente paso</dt>
                            <dd class="font-semibold text-on-surface">Seguimiento interno</dd>
                        </div>
                    </dl>
                </div>
            </div>
        </section>
    </main>

    <footer class="border-t border-outline-variant bg-surface-container-highest">
        <div class="mx-auto flex w-full max-w-[1280px] flex-col gap-4 px-4 py-6 text-sm text-on-surface-variant sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <p>© PrawnForms. Solicitudes centralizadas para seguimiento interno.</p>
            <a href="/admin/login" class="font-medium text-primary transition-colors duration-200 hover:text-surface-tint">Acceso interno</a>
        </div>
    </footer>
</body>
</html>
