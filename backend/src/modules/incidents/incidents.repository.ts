import type { Incident } from './incidents.types.js';

const incidents = new Map<string, Incident>();

export const incidentRepository = {
  save(incident: Incident): void {
    incidents.set(incident.id, incident);
  },

  findById(id: string): Incident | undefined {
    return incidents.get(id);
  },

  findByUser(userId: string): Incident[] {
    return Array.from(incidents.values()).filter((i) => i.userId === userId);
  },

  findAll(): Incident[] {
    return Array.from(incidents.values());
  },

  update(incident: Incident): void {
    incidents.set(incident.id, incident);
  },
};
