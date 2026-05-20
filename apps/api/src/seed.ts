import bcrypt from 'bcrypt'
import { connectDatabase, getDatabase, closeDatabase } from './db/index'
import { users, incidents } from './db/schema'

async function main() {
  const dbPath = process.env.DB_PATH || './data/krill.db'
  console.log(`Seeding database at ${dbPath}...`)

  connectDatabase(dbPath)
  const db = getDatabase()

  const passwordHash = await bcrypt.hash('password123', 12)
  const now = new Date().toISOString()

  // Clean existing data (respect FK order)
  db.delete(incidents).run()
  db.delete(users).run()

  // Users
  const adminResult = db.insert(users).values({
    email: 'admin@coworking.com',
    passwordHash,
    name: 'María García',
    role: 'admin',
    createdAt: now,
    updatedAt: now,
  }).returning().get()

  const anaResult = db.insert(users).values({
    email: 'ana@example.com',
    passwordHash,
    name: 'Ana López',
    role: 'user',
    createdAt: now,
    updatedAt: now,
  }).returning().get()

  const carlosResult = db.insert(users).values({
    email: 'carlos@example.com',
    passwordHash,
    name: 'Carlos Mendoza',
    role: 'user',
    createdAt: now,
    updatedAt: now,
  }).returning().get()

  const adminId = adminResult.id
  const anaId = anaResult.id
  const carlosId = carlosResult.id

  console.log(`Users created: admin@coworking.com (admin), ana@example.com, carlos@example.com (password: password123)`)

  const incidentsData = [
    {
      title: 'Aire acondicionado no enfría en sala 3',
      description: 'Desde ayer el aire acondicionado de la sala 3 solo expulsa aire a temperatura ambiente. Hace mucho calor y los miembros del equipo no pueden trabajar cómodamente. Se revisó el termostato pero parece ser un problema del compresor.',
      priority: 'high',
      status: 'open',
      createdBy: anaId,
      assignedTo: null,
    },
    {
      title: 'Impresora HP láser atascada',
      description: 'La impresora de la zona de impresión tiene un atasco de papel que no se puede retirar siguiendo las instrucciones de la pantalla. El papel quedó atrapado en el rodillo interno.',
      priority: 'medium',
      status: 'in_progress',
      createdBy: anaId,
      assignedTo: adminId,
    },
    {
      title: 'WiFi inestable en el área de coworking abierto',
      description: 'La conexión WiFi se corta intermitentemente cada 10-15 minutos en el área de coworking abierto (puestos 1 al 15). Los dispositivos móviles muestran red disponible pero sin acceso a internet.',
      priority: 'high',
      status: 'open',
      createdBy: carlosId,
      assignedTo: null,
    },
    {
      title: 'Cafetera SuperAutomática no enciende',
      description: 'La cafetera de la cocina comunitaria no enciende. Se probó cambiando de enchufe pero sigue sin recibir corriente. Es la cafetera principal y ya varios usuarios se quejaron.',
      priority: 'low',
      status: 'resolved',
      createdBy: anaId,
      assignedTo: adminId,
    },
    {
      title: 'Puerta principal no cierra con tarjeta',
      description: 'La puerta de entrada principal a veces no reconoce las tarjetas de acceso. Hay que intentar 3 o 4 veces para que el lector responda. Ocurre con varias tarjetas diferentes.',
      priority: 'medium',
      status: 'closed',
      createdBy: carlosId,
      assignedTo: adminId,
    },
    {
      title: 'Fuga de agua en lavabo del baño de mujeres',
      description: 'El lavabo del baño de mujeres tiene una fuga constante por la llave del agua fría. El agua se acumula en el piso y ya hay un charco. Es resbaladizo y peligroso.',
      priority: 'critical',
      status: 'open',
      createdBy: anaId,
      assignedTo: null,
    },
    {
      title: 'Silla ergonómica del puesto 12 tiene el pistón dañado',
      description: 'La silla del puesto 12 ya no mantiene la altura. Al sentarse, el pistón cede lentamente hasta quedar en la posición más baja. No es ajustable.',
      priority: 'low',
      status: 'in_progress',
      createdBy: carlosId,
      assignedTo: adminId,
    },
    {
      title: 'Enchufe suelto en puesto 7',
      description: 'El enchufe de pared del puesto 7 está suelto. Al conectar un cargador, el enchufe se hunde hacia adentro y pierde contacto. Hay que mantenerlo presionado para que cargue.',
      priority: 'low',
      status: 'resolved',
      createdBy: anaId,
      assignedTo: adminId,
    },
    {
      title: 'Sensor de temperatura del rack de servidores dispara alarma',
      description: 'El sensor de temperatura en el cuarto de servidores está disparando falsas alarmas cada 2 horas. La temperatura real es normal (22°C) pero el sensor marca 35°C intermitentemente.',
      priority: 'critical',
      status: 'in_progress',
      createdBy: adminId,
      assignedTo: adminId,
    },
    {
      title: 'Ventana de sala de reuniones 2 no sella correctamente',
      description: 'La ventana corrediza de la sala de reuniones 2 tiene un espacio de aproximadamente 3mm cuando está cerrada. Se siente corriente de aire y el ruido de la calle entra.',
      priority: 'medium',
      status: 'closed',
      createdBy: carlosId,
      assignedTo: adminId,
    },
    {
      title: 'Olor a gas cerca de la cocina',
      description: 'Se percibe un olor leve a gas cerca de la estufa de la cocina. Podría ser una fuga menor. Es mejor revisarlo pronto.',
      priority: 'critical',
      status: 'open',
      createdBy: carlosId,
      assignedTo: null,
    },
    {
      title: 'Proyector de sala 1 muestra imagen distorsionada',
      description: 'El proyector HDMI de la sala de reuniones 1 muestra una imagen con líneas verticales y colores distorsionados. Ya se cambió el cable HDMI pero el problema persiste.',
      priority: 'medium',
      status: 'open',
      createdBy: anaId,
      assignedTo: null,
    },
  ]

  for (const inc of incidentsData) {
    db.insert(incidents).values({
      title: inc.title,
      description: inc.description,
      status: inc.status,
      priority: inc.priority,
      createdBy: inc.createdBy,
      assignedTo: inc.assignedTo,
      createdAt: now,
      updatedAt: now,
    }).run()
  }

  console.log(`Seeded ${incidentsData.length} incidents`)
  console.log('\n--- Credenciales de prueba ---')
  console.log('Admin:   admin@coworking.com / password123')
  console.log('Usuario: ana@example.com      / password123')
  console.log('Usuario: carlos@example.com   / password123')

  closeDatabase()
  process.exit(0)
}

main().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
