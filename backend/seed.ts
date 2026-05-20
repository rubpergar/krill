import { authService } from './src/modules/auth/auth.service.js';
import { authRepository } from './src/modules/auth/auth.repository.js';
import { incidentService } from './src/modules/incidents/incidents.service.js';
import { commentService } from './src/modules/comments/comments.service.js';

async function seed() {
  console.log('🌱 Seeding data...\n');

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@coworking.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  await authService.seedAdmin(adminEmail, adminPassword);

  const adminUserRaw = authRepository.findByEmail(adminEmail);
  const adminId = adminUserRaw!.id;
  console.log(`  ✓ Admin: ${adminEmail}`);

  const ana = await authService.register({
    email: 'ana@example.com',
    password: '123456',
    name: 'Ana García',
  });
  console.log(`  ✓ User: ${ana.user.email} — ${ana.user.name}`);

  const carlos = await authService.register({
    email: 'carlos@example.com',
    password: '123456',
    name: 'Carlos Mendoza',
  });
  console.log(`  ✓ User: ${carlos.user.email} — ${carlos.user.name}`);

  const laura = await authService.register({
    email: 'laura@example.com',
    password: '123456',
    name: 'Laura Jiménez',
  });
  console.log(`  ✓ User: ${laura.user.email} — ${laura.user.name}`);

  // --- Incidents for Ana ---
  const inc1 = incidentService.create(
    {
      title: 'PC del puesto 12 no enciende',
      description:
        'Al pulsar el botón de encendido no se escucha ningún ventilador ni se encienden los LEDs. Probé cambiando el cable de corriente y sigue igual.',
      category: 'hardware',
      priority: 'high',
    },
    ana.user.id,
  );
  // Manually set createdAt to 3 days ago for realistic data
  inc1.createdAt = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
  incidentService.updateStatus(inc1.id, { status: 'in_progress' }, ana.user.id, false);
  console.log(`  ✓ Incident: "${inc1.title}" (${inc1.status}, ${inc1.priority})`);

  const inc2 = incidentService.create(
    {
      title: 'WiFi no funciona en sala B',
      description:
        'Desde ayer la sala B no tiene conexión a internet. Varios compañeros lo reportaron. El router se ve pero no asigna IP.',
      category: 'network',
      priority: 'critical',
    },
    ana.user.id,
  );
  inc2.createdAt = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
  console.log(`  ✓ Incident: "${inc2.title}" (${inc2.status}, ${inc2.priority})`);

  const inc3 = incidentService.create(
    {
      title: 'Silla despachurrada',
      description:
        'El soporte neumático de la silla del puesto 7 ya no sostiene y baja sola. Es difícil trabajar así.',
      category: 'facilities',
      priority: 'low',
    },
    ana.user.id,
  );
  inc3.createdAt = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);
  incidentService.updateStatus(inc3.id, { status: 'resolved' }, ana.user.id, false);
  console.log(`  ✓ Incident: "${inc3.title}" (${inc3.status}, ${inc3.priority})`);

  const inc4 = incidentService.create(
    {
      title: 'Impresora HP laser atascada',
      description:
        'La impresora de la sala común tiene un atasco de papel que no puedo quitar. Muestra error E-04 en la pantalla.',
      category: 'hardware',
      priority: 'medium',
    },
    ana.user.id,
  );
  inc4.createdAt = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000);
  incidentService.updateStatus(inc4.id, { status: 'closed' }, ana.user.id, false);
  console.log(`  ✓ Incident: "${inc4.title}" (${inc4.status}, ${inc4.priority})`);

  // --- Incidents for Carlos ---
  const inc5 = incidentService.create(
    {
      title: 'Outlook no sincroniza correo',
      description:
        'Desde esta mañana Outlook deja de recibir correos. El resto de compañeros con el mismo servicio funcionan bien. Probé reiniciar y nada.',
      category: 'software',
      priority: 'high',
    },
    carlos.user.id,
  );
  inc5.createdAt = new Date(Date.now() - 4 * 24 * 60 * 60 * 1000);
  incidentService.updateStatus(inc5.id, { status: 'resolved' }, carlos.user.id, false);
  console.log(`  ✓ Incident: "${inc5.title}" (${inc5.status}, ${inc5.priority})`);

  const inc6 = incidentService.create(
    {
      title: 'Aire acondicionado no enfría',
      description:
        'La sala principal está a 28°C. El termostato marca 18°C pero el aire solo tira aire a temperatura ambiente.',
      category: 'facilities',
      priority: 'critical',
    },
    carlos.user.id,
  );
  inc6.createdAt = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000);
  console.log(`  ✓ Incident: "${inc6.title}" (${inc6.status}, ${inc6.priority})`);

  const inc7 = incidentService.create(
    {
      title: 'Puerta de acceso principal no cierra',
      description:
        'La puerta giratoria de la entrada principal no cierra del todo y entra corriente de aire frío. Además el sistema de tarjeta a veces no responde.',
      category: 'facilities',
      priority: 'medium',
    },
    carlos.user.id,
  );
  inc7.createdAt = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000);
  incidentService.updateStatus(inc7.id, { status: 'in_progress' }, carlos.user.id, false);
  console.log(`  ✓ Incident: "${inc7.title}" (${inc7.status}, ${inc7.priority})`);

  const inc8 = incidentService.create(
    {
      title: 'Monitor parpadea intermitentemente',
      description:
        'El monitor del puesto 5 parpadea cada 10-15 segundos. Ya probé con otro cable DisplayPort y sigue igual.',
      category: 'hardware',
      priority: 'low',
    },
    carlos.user.id,
  );
  inc8.createdAt = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  console.log(`  ✓ Incident: "${inc8.title}" (${inc8.status}, ${inc8.priority})`);

  // --- Incidents for Laura ---
  const inc9 = incidentService.create(
    {
      title: 'Error 500 al subir archivos al NAS',
      description:
        'Cuando intento subir archivos de más de 10MB al NAS corporativo recibo un error 500. Archivos pequeños funcionan bien.',
      category: 'software',
      priority: 'high',
    },
    laura.user.id,
  );
  inc9.createdAt = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
  incidentService.updateStatus(inc9.id, { status: 'in_progress' }, laura.user.id, false);
  console.log(`  ✓ Incident: "${inc9.title}" (${inc9.status}, ${inc9.priority})`);

  const inc10 = incidentService.create(
    {
      title: 'Fuga de agua en baño de caballeros',
      description:
        'El lavamanos del baño de caballeros gotea constantemente. Ya hay un charco en el piso. Podría ser la junta del grifo.',
      category: 'facilities',
      priority: 'critical',
    },
    laura.user.id,
  );
  inc10.createdAt = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000);
  console.log(`  ✓ Incident: "${inc10.title}" (${inc10.status}, ${inc10.priority})`);

  const inc11 = incidentService.create(
    {
      title: 'Cafetera descompuesta',
      description:
        'La máquina de café de la cocina no calienta el agua. Sale agua fría. Ya revisé el depósito y está lleno.',
      category: 'other',
      priority: 'medium',
    },
    laura.user.id,
  );
  inc11.createdAt = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
  console.log(`  ✓ Incident: "${inc11.title}" (${inc11.status}, ${inc11.priority})`);

  const inc12 = incidentService.create(
    {
      title: 'VPN corporativo no conecta',
      description:
        'Desde la red del coworking no puedo conectar a la VPN de mi empresa. Aparece error de timeout. Funciona desde mi casa.',
      category: 'network',
      priority: 'high',
    },
    laura.user.id,
  );
  inc12.createdAt = new Date(Date.now() - 4 * 24 * 60 * 60 * 1000);
  incidentService.updateStatus(inc12.id, { status: 'resolved' }, laura.user.id, false);
  console.log(`  ✓ Incident: "${inc12.title}" (${inc12.status}, ${inc12.priority})`);

  // --- Comments ---
  commentService.add(
    { content: 'Voy a revisarlo ahora mismo. Por favor no intentes encenderlo de nuevo hasta que llegue.' },
    inc1.id,
    adminId,
    true,
  );
  commentService.add(
    { content: 'Actualización: cambié la fuente de poder y ya enciende. Queda en prueba hasta mañana.' },
    inc1.id,
    adminId,
    true,
  );

  commentService.add(
    { content: 'Ya llamé al técnico de climatización. Vendrá mañana entre 10 y 12.' },
    inc6.id,
    adminId,
    true,
  );
  commentService.add(
    { content: 'Gracias. Estaré atento a la visita.' },
    inc6.id,
    carlos.user.id,
    false,
  );

  commentService.add(
    { content: 'Revisé el grifo: necesita cambiar la junta. Lo haré esta tarde.' },
    inc10.id,
    adminId,
    true,
  );

  commentService.add(
    { content: 'El atasco era un clip dentro del mecanismo. Ya está operativa.' },
    inc4.id,
    adminId,
    true,
  );

  commentService.add(
    { content: 'Probé a reiniciar el router de la sala B y parece que ya funciona. ¿Podéis confirmar?' },
    inc2.id,
    adminId,
    true,
  );

  commentService.add(
    { content: 'Acabo de probar y ya tengo conexión. ¡Gracias!' },
    inc2.id,
    ana.user.id,
    false,
  );

  commentService.add(
    { content: 'El problema del NAS era un permiso en la carpeta compartida. Ya está solucionado.' },
    inc9.id,
    adminId,
    true,
  );

  // --- Summary ---
  const totalIncidents = [
    inc1, inc2, inc3, inc4, inc5, inc6, inc7, inc8, inc9, inc10, inc11, inc12,
  ].length;

  console.log(`\n✅ Seeding complete!`);
  console.log(`   Users:      Ana, Carlos, Laura + admin`);
  console.log(`   Incidents:  ${totalIncidents}`);
  console.log(`   Comments:   9`);
  console.log(`\n   Credentials:`);
  console.log(`     ana@example.com          / 123456`);
  console.log(`     carlos@example.com       / 123456`);
  console.log(`     laura@example.com        / 123456`);
  console.log(`     admin@coworking.com      / admin123`);
}

// Allow running directly: pnpm --filter backend seed
const isMain = process.argv[1]?.endsWith('seed.ts');
if (isMain) {
  seed().catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  });
}

export { seed };
