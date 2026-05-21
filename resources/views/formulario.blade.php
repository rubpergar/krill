<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PrawnForms - Contacto</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 min-h-screen flex items-center justify-center">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
        <h1 class="text-2xl font-bold mb-6 text-center">Formulario de Contacto</h1>

        @if (session('status'))
            <div class="mb-4 rounded-md bg-green-50 p-4 text-sm text-green-700">
                {{ session('status') }}
            </div>
        @endif

        @if ($errors->any())
            <div class="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">
                Revisa los campos del formulario.
            </div>
        @endif

        <form method="POST" action="/" class="space-y-4">
            @csrf

            <div style="display: none;">
                <input type="text" name="website_url" tabindex="-1" autocomplete="off">
            </div>

            <div>
                <label for="nombre" class="block text-sm font-medium text-gray-700">Nombre</label>
                <input type="text" name="nombre" id="nombre" value="{{ old('nombre') }}" required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
            </div>

            <div>
                <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" name="email" id="email" value="{{ old('email') }}" required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
            </div>

            <div>
                <label for="telefono" class="block text-sm font-medium text-gray-700">Teléfono</label>
                <input type="tel" name="telefono" id="telefono" value="{{ old('telefono') }}" required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
            </div>

            <div>
                <label for="empresa" class="block text-sm font-medium text-gray-700">Empresa</label>
                <input type="text" name="empresa" id="empresa" value="{{ old('empresa') }}" required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
            </div>

            <div>
                <label for="tipo_necesidad" class="block text-sm font-medium text-gray-700">Tipo de necesidad</label>
                <select name="tipo_necesidad" id="tipo_necesidad" required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                    <option value="">Seleccione...</option>
                    @foreach ($tiposNecesidad as $tipoNecesidad)
                        <option value="{{ $tipoNecesidad->value }}" @selected(old('tipo_necesidad') === $tipoNecesidad->value)>
                            {{ $tipoNecesidad->value }}
                        </option>
                    @endforeach
                </select>
            </div>

            <div>
                <label for="mensaje" class="block text-sm font-medium text-gray-700">Mensaje</label>
                <textarea name="mensaje" id="mensaje" rows="4" required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">{{ old('mensaje') }}</textarea>
            </div>

            <div class="flex items-start">
                <input type="checkbox" name="consentimiento" id="consentimiento" required
                    value="1" @checked(old('consentimiento'))
                    class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 mt-1">
                <label for="consentimiento" class="ml-2 block text-sm text-gray-700">
                    He leído y acepto la política de privacidad
                </label>
            </div>

            <div>
                <button type="submit"
                    class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Enviar
                </button>
            </div>
        </form>
    </div>
</body>
</html>
