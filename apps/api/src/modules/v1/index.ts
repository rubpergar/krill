import { Hono } from 'hono'
import { authRoutes } from '../auth/auth.routes'
import { adminRoutes } from '../admin/admin.routes'
import { adminIncidentsRoutes } from '../admin/admin-incidents.routes'
import { incidentsRoutes } from '../incidents/incidents.routes'

const v1Routes = new Hono()

v1Routes.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() })
})

v1Routes.route('/auth', authRoutes)
v1Routes.route('/admin', adminRoutes)
v1Routes.route('/admin/incidents', adminIncidentsRoutes)
v1Routes.route('/incidents', incidentsRoutes)

export { v1Routes }
