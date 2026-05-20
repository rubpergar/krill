import { randomUUID } from 'node:crypto';
import { incidentService } from '../incidents/incidents.service.js';
import { commentRepository } from './comments.repository.js';
import type { Comment, CreateCommentDto } from './comments.types.js';

export const commentService = {
  add(
    dto: CreateCommentDto,
    incidentId: string,
    userId: string,
    isAdmin: boolean,
  ): Comment {
    incidentService.getById(incidentId, userId, isAdmin);

    const comment: Comment = {
      id: randomUUID(),
      incidentId,
      userId,
      content: dto.content.trim(),
      createdAt: new Date(),
    };

    commentRepository.save(comment);
    return comment;
  },

  listByIncident(
    incidentId: string,
    userId: string,
    isAdmin: boolean,
  ): Comment[] {
    incidentService.getById(incidentId, userId, isAdmin);
    return commentRepository.findByIncident(incidentId);
  },
};
