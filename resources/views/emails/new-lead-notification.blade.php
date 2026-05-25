<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nueva solicitud recibida</title>
    <style>
        body {
            font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background-color: #f5faf8;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 24px;
        }
        .card {
            background-color: #ffffff;
            border: 1px solid #bcc9c6;
            border-radius: 12px;
            padding: 32px;
            margin-top: 16px;
        }
        .header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 24px;
        }
        .logo {
            width: 32px;
            height: 32px;
            background-color: #0d9488;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            font-weight: 700;
            font-size: 14px;
        }
        .title {
            font-size: 20px;
            font-weight: 700;
            color: #171d1c;
            margin: 0;
        }
        .badge {
            display: inline-block;
            background-color: #0d9488;
            color: #ffffff;
            padding: 4px 12px;
            border-radius: 999px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            margin-bottom: 8px;
        }
        .field {
            margin-bottom: 16px;
        }
        .label {
            font-size: 12px;
            font-weight: 600;
            color: #3d4947;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 4px;
        }
        .value {
            font-size: 14px;
            color: #171d1c;
            line-height: 1.5;
        }
        .divider {
            border: none;
            border-top: 1px solid #bcc9c6;
            margin: 24px 0;
        }
        .footer {
            font-size: 12px;
            color: #64748b;
            text-align: center;
            margin-top: 24px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="card">
            <div class="header">
                <div class="logo">P</div>
                <h1 class="title">Nueva solicitud recibida</h1>
            </div>

            <span class="badge">Lead capture</span>

            <p style="font-size: 14px; color: #3d4947; line-height: 1.6; margin-bottom: 24px;">
                Se ha recibido una nueva solicitud a través del formulario público. Revisa los detalles a continuación.
            </p>

            <hr class="divider">

            <div class="field">
                <div class="label">Nombre</div>
                <div class="value">{{ $lead->nombre }}</div>
            </div>

            <div class="field">
                <div class="label">Email</div>
                <div class="value">{{ $lead->email }}</div>
            </div>

            <div class="field">
                <div class="label">Teléfono</div>
                <div class="value">{{ $lead->telefono ?? '—' }}</div>
            </div>

            <div class="field">
                <div class="label">Empresa</div>
                <div class="value">{{ $lead->empresa ?? '—' }}</div>
            </div>

            <div class="field">
                <div class="label">Tipo de necesidad</div>
                <div class="value">{{ $lead->tipo_necesidad?->value ?? $lead->tipo_necesidad }}</div>
            </div>

            <hr class="divider">

            <div class="field">
                <div class="label">Mensaje</div>
                <div class="value">{{ $lead->mensaje }}</div>
            </div>

            <hr class="divider">

            <p style="font-size: 14px; color: #3d4947; line-height: 1.6;">
                <a href="{{ url('/admin/leads/'.$lead->id) }}" style="color: #0d9488; font-weight: 600; text-decoration: none;">
                    Ver solicitud en el panel →
                </a>
            </p>
        </div>

        <div class="footer">
            <p>© PrawnForms. Sistema de captación y seguimiento de solicitudes.</p>
            <p>Este mensaje se envió automáticamente desde el formulario público.</p>
        </div>
    </div>
</body>
</html>
