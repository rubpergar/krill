<!DOCTYPE html>
<html lang="es" class="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PrawnForms - Privacidad</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="bg-background text-on-background font-sans antialiased min-h-screen flex flex-col">
    <nav class="sticky top-0 z-40 border-b border-outline-variant bg-surface/95 backdrop-blur">
        <div class="mx-auto flex w-full max-w-[960px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <a href="/" class="text-sm font-semibold text-primary">PrawnForms</a>
            <a href="/" class="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-on-primary shadow-sm transition-colors duration-200 hover:bg-surface-tint focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2">
                Volver al formulario
            </a>
        </div>
    </nav>

    <main class="mx-auto w-full max-w-[960px] flex-1 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <section class="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-md sm:p-8">
            <p class="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Privacidad</p>
            <h1 class="mt-3 text-3xl font-bold tracking-[-0.02em] text-on-surface sm:text-4xl">Política de privacidad básica</h1>
            <p class="mt-4 text-base leading-7 text-on-surface-variant">
                Esta página resume cómo PrawnForms trata los datos enviados desde el formulario público. Es un aviso operativo básico y debe revisarse legalmente antes de producción.
            </p>

            <div class="mt-8 grid gap-5">
                <article class="rounded-lg border border-outline-variant bg-surface-container-low p-5">
                    <h2 class="text-lg font-semibold text-on-surface">Responsable</h2>
                    <p class="mt-2 text-sm leading-6 text-on-surface-variant">PrawnForms, como proyecto de captación y seguimiento interno de solicitudes.</p>
                </article>

                <article class="rounded-lg border border-outline-variant bg-surface-container-low p-5">
                    <h2 class="text-lg font-semibold text-on-surface">Finalidad</h2>
                    <p class="mt-2 text-sm leading-6 text-on-surface-variant">Recibir solicitudes, analizarlas internamente, asignar responsables y contactar con la persona solicitante.</p>
                </article>

                <article class="rounded-lg border border-outline-variant bg-surface-container-low p-5">
                    <h2 class="text-lg font-semibold text-on-surface">Datos tratados</h2>
                    <p class="mt-2 text-sm leading-6 text-on-surface-variant">Nombre, email, teléfono, empresa, tipo de necesidad, mensaje, fecha de consentimiento, IP de origen y user-agent técnico.</p>
                </article>

                <article class="rounded-lg border border-outline-variant bg-surface-container-low p-5">
                    <h2 class="text-lg font-semibold text-on-surface">Acceso interno</h2>
                    <p class="mt-2 text-sm leading-6 text-on-surface-variant">Los datos se consultan desde un panel privado protegido por autenticación. Las cuentas inactivas no pueden acceder al panel.</p>
                </article>

                <article class="rounded-lg border border-outline-variant bg-surface-container-low p-5">
                    <h2 class="text-lg font-semibold text-on-surface">Conservación</h2>
                    <p class="mt-2 text-sm leading-6 text-on-surface-variant">Las solicitudes se conservan mientras sean necesarias para su seguimiento. Pueden archivarse y, con permisos de administrador, eliminarse físicamente cuando ya estén archivadas.</p>
                </article>

                <article class="rounded-lg border border-outline-variant bg-surface-container-low p-5">
                    <h2 class="text-lg font-semibold text-on-surface">Contacto</h2>
                    <p class="mt-2 text-sm leading-6 text-on-surface-variant">El canal formal de contacto de privacidad queda pendiente de definir antes de producción.</p>
                </article>
            </div>
        </section>
    </main>
</body>
</html>
