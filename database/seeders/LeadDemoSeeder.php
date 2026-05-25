<?php

namespace Database\Seeders;

use App\Models\EventoAuditoria;
use App\Models\Lead;
use App\Models\NotaInterna;
use App\Models\User;
use Illuminate\Database\Seeder;

class LeadDemoSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::firstOrCreate(
            ['email' => 'admin@prawnforms.test'],
            [
                'name' => 'Admin',
                'password' => bcrypt('password'),
                'rol' => 'admin',
                'activo' => true,
            ]
        );

        $agentes = [
            User::firstOrCreate(
                ['email' => 'ana@prawnforms.test'],
                ['name' => 'Ana Seguimiento', 'password' => bcrypt('password'), 'rol' => 'usuario', 'activo' => true],
            ),
            User::firstOrCreate(
                ['email' => 'carlos@prawnforms.test'],
                ['name' => 'Carlos Ventas', 'password' => bcrypt('password'), 'rol' => 'usuario', 'activo' => true],
            ),
            User::firstOrCreate(
                ['email' => 'laura@prawnforms.test'],
                ['name' => 'Laura Soporte', 'password' => bcrypt('password'), 'rol' => 'usuario', 'activo' => true],
            ),
            User::firstOrCreate(
                ['email' => 'miguel@prawnforms.test'],
                ['name' => 'Miguel Onboarding', 'password' => bcrypt('password'), 'rol' => 'usuario', 'activo' => true],
            ),
            User::firstOrCreate(
                ['email' => 'inactivo@prawnforms.test'],
                ['name' => 'Usuario Inactivo', 'password' => bcrypt('password'), 'rol' => 'usuario', 'activo' => false],
            ),
        ];

        [$ana, $carlos, $laura, $miguel] = $agentes;

        $leadsData = [
            [
                'nombre' => 'María García López',
                'email' => 'maria.garcia@email.com',
                'telefono' => '612345678',
                'empresa' => 'TechSolutions SL',
                'tipo_necesidad' => 'Presupuesto',
                'mensaje' => 'Buenas, necesitamos un presupuesto para implementar un sistema de gestión de leads en nuestra empresa. Somos una veintena de usuarios.',
                'estado' => 'Convertido',
                'responsable_id' => $carlos->id,
            ],
            [
                'nombre' => 'Javier Martínez Ruiz',
                'email' => 'javier.martinez@correo.es',
                'telefono' => '698765432',
                'empresa' => 'InnovaCorp',
                'tipo_necesidad' => 'Consulta',
                'mensaje' => 'Hola, me gustaría saber qué planes de precio tenéis y si hacéis demostraciones personalizadas para equipos pequeños.',
                'estado' => 'En seguimiento',
                'responsable_id' => $carlos->id,
            ],
            [
                'nombre' => 'Elena Fernández Pérez',
                'email' => 'elena.fp@outlook.com',
                'telefono' => '655123987',
                'empresa' => 'PymeDigital',
                'tipo_necesidad' => 'Colaboración',
                'mensaje' => 'Estamos interesados en una colaboración estratégica. Nuestra plataforma complementa vuestro servicio y creemos que podemos generar sinergias. Contactadme para hablar.',
                'estado' => 'Revisado',
                'responsable_id' => null,
            ],
            [
                'nombre' => 'David López Sánchez',
                'email' => 'david.lopez@empresa.co',
                'telefono' => null,
                'empresa' => 'Grupo DataSend',
                'tipo_necesidad' => 'Soporte',
                'mensaje' => 'Desde hace dos días el formulario de contacto de nuestra web no envía los datos correctamente. Creemos que puede ser un problema con vuestra API.',
                'estado' => 'Contactado',
                'responsable_id' => $laura->id,
            ],
            [
                'nombre' => 'Sofía Romero Díaz',
                'email' => 'sofia.romero@gmail.com',
                'telefono' => '677888999',
                'empresa' => 'Freelance Studio',
                'tipo_necesidad' => 'Presupuesto',
                'mensaje' => 'Soy diseñadora freelance y estoy montando mi propia agencia. Me interesa vuestra herramienta pero necesito saber si hay un plan para autónomos.',
                'estado' => 'Nuevo',
                'responsable_id' => null,
            ],
            [
                'nombre' => 'Antonio Jiménez Navarro',
                'email' => 'ajimenez@distribuidora.es',
                'telefono' => '611222333',
                'empresa' => 'Distribuidora del Sur',
                'tipo_necesidad' => 'Consulta',
                'mensaje' => 'Queremos migrar desde un CRM tradicional a una solución más ligera. ¿Ofrecéis soporte para importación masiva de contactos?',
                'estado' => 'Nuevo',
                'responsable_id' => null,
            ],
            [
                'nombre' => 'Cristina Torres Morales',
                'email' => 'cristina.torres@startup.io',
                'telefono' => '644556677',
                'empresa' => 'CloudStartup',
                'tipo_necesidad' => 'Otro',
                'mensaje' => 'Hola, soy CTO de una startup y me gustaría hablar con alguien de producto sobre una posible integración con nuestra plataforma.',
                'estado' => 'Nuevo',
                'responsable_id' => null,
            ],
            [
                'nombre' => 'Roberto Gil Medina',
                'email' => 'rgil@consultora.com',
                'telefono' => null,
                'empresa' => 'Consultora GM',
                'tipo_necesidad' => 'Presupuesto',
                'mensaje' => 'Necesitamos un presupuesto corporativo para 50 usuarios. Por favor incluid opciones de API y webhooks.',
                'estado' => 'Descartado',
                'responsable_id' => $ana->id,
            ],
            [
                'nombre' => 'Patricia Ortiz Flores',
                'email' => 'patricia.ortiz@mail.com',
                'telefono' => '688777666',
                'empresa' => 'Boutique Legal',
                'tipo_necesidad' => 'Colaboración',
                'mensaje' => 'Somos un despacho de abogados interesados en recomendar vuestra herramienta a nuestros clientes. ¿Tenéis algún programa de afiliados o partners?',
                'estado' => 'En seguimiento',
                'responsable_id' => $ana->id,
            ],
            [
                'nombre' => 'Álvaro Ramírez Peña',
                'email' => 'aramirez@eduformacion.es',
                'telefono' => '655444333',
                'empresa' => 'EduFormación',
                'tipo_necesidad' => 'Soporte',
                'mensaje' => 'Buenas tardes, estamos teniendo problemas con la autenticación de usuarios después de la última actualización. Los usuarios inactivos siguen apareciendo como activos en el panel.',
                'estado' => 'Revisado',
                'responsable_id' => $laura->id,
            ],
            [
                'nombre' => 'Marta Serra Costa',
                'email' => 'mserra@agencia.es',
                'telefono' => '677111222',
                'empresa' => null,
                'tipo_necesidad' => 'Presupuesto',
                'mensaje' => 'Trabajo como community manager para varias marcas y necesito una herramienta para centralizar las solicitudes de mis clientes. ¿Tenéis algo para agencias pequeñas?',
                'estado' => 'Contactado',
                'responsable_id' => $miguel->id,
            ],
            [
                'nombre' => 'Isabel Herrero Vega',
                'email' => 'iherrero@techfactory.com',
                'telefono' => '699000111',
                'empresa' => 'TechFactory',
                'tipo_necesidad' => 'Consulta',
                'mensaje' => 'Nos gustaría una demo en vivo para nuestro equipo de 15 personas. ¿Cómo agendamos una sesión?',
                'estado' => 'Nuevo',
                'responsable_id' => null,
            ],
            [
                'nombre' => 'Daniel Castillo Rojas',
                'email' => 'dcastillo@logistica.net',
                'telefono' => null,
                'empresa' => 'LogiRed',
                'tipo_necesidad' => 'Otro',
                'mensaje' => 'Queremos saber si vuestra solución cumple con la normativa RGPD para el tratamiento de datos de clientes en el sector logístico.',
                'estado' => 'Descartado',
                'responsable_id' => $miguel->id,
            ],
            [
                'nombre' => 'Laura Blanco Herrero',
                'email' => 'laura.blanco@asesoria.com',
                'telefono' => '688333444',
                'empresa' => 'Asesoría BH',
                'tipo_necesidad' => 'Presupuesto',
                'mensaje' => 'Necesito un plan para 3 usuarios de mi asesoría. ¿Ofrecéis factura electrónica integrada?',
                'estado' => 'Nuevo',
                'responsable_id' => null,
            ],
            [
                'nombre' => 'Sergio Márquez Delgado',
                'email' => 'smarquez@inmobiliaria.es',
                'telefono' => '655888999',
                'empresa' => 'Inmobiliaria MD',
                'tipo_necesidad' => 'Colaboración',
                'mensaje' => 'Nos dedicamos al alquiler de propiedades y queremos automatizar la captación de leads desde nuestra web y redes sociales.',
                'estado' => 'Convertido',
                'responsable_id' => $miguel->id,
            ],
        ];

        $notas = [
            ['lead_idx' => 0, 'autor_idx' => 1, 'contenido' => 'Cliente interesado en plan corporativo. Llama para cerrar detalles la próxima semana.'],
            ['lead_idx' => 0, 'autor_idx' => 1, 'contenido' => 'Llamada realizada. Acepta presupuesto. Envío contrato.'],
            ['lead_idx' => 1, 'autor_idx' => 1, 'contenido' => 'Pide demo personalizada. Pendiente de coordinar fecha con equipo de producto.'],
            ['lead_idx' => 3, 'autor_idx' => 2, 'contenido' => 'Problema reportado con la API de envío. Revisando logs.'],
            ['lead_idx' => 3, 'autor_idx' => 2, 'contenido' => 'Error identificado: timeout en endpoint de validación. Se corrigió en deploy de esta mañana. Cliente notificado.'],
            ['lead_idx' => 8, 'autor_idx' => 0, 'contenido' => 'Buen candidato para programa de partners. Derivar a equipo de alianzas.'],
            ['lead_idx' => 9, 'autor_idx' => 2, 'contenido' => 'Cliente reporta bug en filtro de usuarios inactivos. Pendiente de escalar a desarrollo.'],
            ['lead_idx' => 10, 'autor_idx' => 3, 'contenido' => 'Llamada realizada. Le interesa el plan básico. Enviar enlace de registro personalizado.'],
        ];

        $auditorias = [
            ['lead_idx' => 0, 'autor_idx' => 0, 'accion' => 'cambio_estado', 'campo' => 'estado', 'anterior' => 'Nuevo', 'nuevo' => 'Revisado'],
            ['lead_idx' => 0, 'autor_idx' => 0, 'accion' => 'asignacion', 'campo' => 'responsable_id', 'anterior' => '', 'nuevo' => 'Carlos Ventas'],
            ['lead_idx' => 0, 'autor_idx' => 1, 'accion' => 'cambio_estado', 'campo' => 'estado', 'anterior' => 'Revisado', 'nuevo' => 'Contactado'],
            ['lead_idx' => 0, 'autor_idx' => 1, 'accion' => 'cambio_estado', 'campo' => 'estado', 'anterior' => 'Contactado', 'nuevo' => 'En seguimiento'],
            ['lead_idx' => 0, 'autor_idx' => 1, 'accion' => 'cambio_estado', 'campo' => 'estado', 'anterior' => 'En seguimiento', 'nuevo' => 'Convertido'],
            ['lead_idx' => 1, 'autor_idx' => 0, 'accion' => 'asignacion', 'campo' => 'responsable_id', 'anterior' => '', 'nuevo' => 'Carlos Ventas'],
            ['lead_idx' => 1, 'autor_idx' => 1, 'accion' => 'cambio_estado', 'campo' => 'estado', 'anterior' => 'Nuevo', 'nuevo' => 'Revisado'],
            ['lead_idx' => 1, 'autor_idx' => 1, 'accion' => 'cambio_estado', 'campo' => 'estado', 'anterior' => 'Revisado', 'nuevo' => 'En seguimiento'],
            ['lead_idx' => 2, 'autor_idx' => 0, 'accion' => 'cambio_estado', 'campo' => 'estado', 'anterior' => 'Nuevo', 'nuevo' => 'Revisado'],
            ['lead_idx' => 3, 'autor_idx' => 0, 'accion' => 'asignacion', 'campo' => 'responsable_id', 'anterior' => '', 'nuevo' => 'Laura Soporte'],
            ['lead_idx' => 3, 'autor_idx' => 2, 'accion' => 'cambio_estado', 'campo' => 'estado', 'anterior' => 'Nuevo', 'nuevo' => 'Revisado'],
            ['lead_idx' => 3, 'autor_idx' => 2, 'accion' => 'cambio_estado', 'campo' => 'estado', 'anterior' => 'Revisado', 'nuevo' => 'Contactado'],
            ['lead_idx' => 7, 'autor_idx' => 0, 'accion' => 'asignacion', 'campo' => 'responsable_id', 'anterior' => '', 'nuevo' => 'Ana Seguimiento'],
            ['lead_idx' => 7, 'autor_idx' => 0, 'accion' => 'cambio_estado', 'campo' => 'estado', 'anterior' => 'Nuevo', 'nuevo' => 'Revisado'],
            ['lead_idx' => 7, 'autor_idx' => 0, 'accion' => 'cambio_estado', 'campo' => 'estado', 'anterior' => 'Revisado', 'nuevo' => 'Descartado'],
            ['lead_idx' => 8, 'autor_idx' => 0, 'accion' => 'asignacion', 'campo' => 'responsable_id', 'anterior' => '', 'nuevo' => 'Ana Seguimiento'],
            ['lead_idx' => 8, 'autor_idx' => 0, 'accion' => 'cambio_estado', 'campo' => 'estado', 'anterior' => 'Nuevo', 'nuevo' => 'Revisado'],
            ['lead_idx' => 8, 'autor_idx' => 0, 'accion' => 'cambio_estado', 'campo' => 'estado', 'anterior' => 'Revisado', 'nuevo' => 'En seguimiento'],
            ['lead_idx' => 9, 'autor_idx' => 0, 'accion' => 'asignacion', 'campo' => 'responsable_id', 'anterior' => '', 'nuevo' => 'Laura Soporte'],
            ['lead_idx' => 9, 'autor_idx' => 2, 'accion' => 'cambio_estado', 'campo' => 'estado', 'anterior' => 'Nuevo', 'nuevo' => 'Revisado'],
            ['lead_idx' => 10, 'autor_idx' => 0, 'accion' => 'asignacion', 'campo' => 'responsable_id', 'anterior' => '', 'nuevo' => 'Miguel Onboarding'],
            ['lead_idx' => 10, 'autor_idx' => 3, 'accion' => 'cambio_estado', 'campo' => 'estado', 'anterior' => 'Nuevo', 'nuevo' => 'Revisado'],
            ['lead_idx' => 10, 'autor_idx' => 3, 'accion' => 'cambio_estado', 'campo' => 'estado', 'anterior' => 'Revisado', 'nuevo' => 'Contactado'],
            ['lead_idx' => 12, 'autor_idx' => 0, 'accion' => 'asignacion', 'campo' => 'responsable_id', 'anterior' => '', 'nuevo' => 'Miguel Onboarding'],
            ['lead_idx' => 12, 'autor_idx' => 0, 'accion' => 'cambio_estado', 'campo' => 'estado', 'anterior' => 'Nuevo', 'nuevo' => 'Revisado'],
            ['lead_idx' => 12, 'autor_idx' => 3, 'accion' => 'cambio_estado', 'campo' => 'estado', 'anterior' => 'Revisado', 'nuevo' => 'Descartado'],
            ['lead_idx' => 14, 'autor_idx' => 0, 'accion' => 'asignacion', 'campo' => 'responsable_id', 'anterior' => '', 'nuevo' => 'Miguel Onboarding'],
            ['lead_idx' => 14, 'autor_idx' => 3, 'accion' => 'cambio_estado', 'campo' => 'estado', 'anterior' => 'Nuevo', 'nuevo' => 'Revisado'],
            ['lead_idx' => 14, 'autor_idx' => 3, 'accion' => 'cambio_estado', 'campo' => 'estado', 'anterior' => 'Revisado', 'nuevo' => 'Contactado'],
            ['lead_idx' => 14, 'autor_idx' => 3, 'accion' => 'cambio_estado', 'campo' => 'estado', 'anterior' => 'Contactado', 'nuevo' => 'En seguimiento'],
            ['lead_idx' => 14, 'autor_idx' => 3, 'accion' => 'cambio_estado', 'campo' => 'estado', 'anterior' => 'En seguimiento', 'nuevo' => 'Convertido'],
        ];

        $createdLeads = [];
        foreach ($leadsData as $data) {
            $createdLeads[] = Lead::create($data);
        }

        foreach ($notas as $nota) {
            NotaInterna::create([
                'lead_id' => $createdLeads[$nota['lead_idx']]->id,
                'usuario_id' => $agentes[$nota['autor_idx']]->id,
                'contenido' => $nota['contenido'],
            ]);
        }

        foreach ($auditorias as $evento) {
            EventoAuditoria::create([
                'lead_id' => $createdLeads[$evento['lead_idx']]->id,
                'usuario_id' => $agentes[$evento['autor_idx']]->id,
                'accion' => $evento['accion'],
                'campo' => $evento['campo'],
                'valor_anterior' => $evento['anterior'],
                'valor_nuevo' => $evento['nuevo'],
            ]);
        }
    }
}
