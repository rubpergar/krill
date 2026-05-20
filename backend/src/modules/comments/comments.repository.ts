import type { Comment } from './comments.types.js';

const comments = new Map<string, Comment>();

export const commentRepository = {
  save(comment: Comment): void {
    comments.set(comment.id, comment);
  },

  findByIncident(incidentId: string): Comment[] {
    return Array.from(comments.values()).filter(
      (c) => c.incidentId === incidentId,
    );
  },
};
