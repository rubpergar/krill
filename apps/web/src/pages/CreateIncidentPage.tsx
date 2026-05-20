import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card } from '../components/ui/Card'
import { useCreateIncident } from '../hooks/useIncidents'
import { useToast } from '../hooks/useToast'

export function CreateIncidentPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('medium')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const createIncident = useCreateIncident()
  const { addToast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!title.trim() || !description.trim()) {
      setError('Todos los campos son obligatorios')
      return
    }
    try {
      await createIncident.mutateAsync({ title, description, priority })
      addToast('Incidencia creada correctamente', 'success')
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear incidencia')
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-neutral-900">Nueva incidencia</h1>
      <Card>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Describe el problema brevemente"
            required
          />
          <div className="flex flex-col gap-1">
            <label htmlFor="description" className="text-sm font-medium text-neutral-700">
              Descripción
            </label>
            <textarea
              id="description"
              className="min-h-[120px] rounded-lg border border-neutral-300 px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe el problema con detalle"
              required
            />
          </div>
          <Input label="Prioridad" type="select" value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="low">Baja</option>
            <option value="medium">Media</option>
            <option value="high">Alta</option>
            <option value="critical">Crítica</option>
          </Input>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-3">
            <Button type="submit" loading={createIncident.isPending}>
              Crear incidencia
            </Button>
            <Button type="button" variant="secondary" onClick={() => navigate('/dashboard')}>
              Cancelar
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
