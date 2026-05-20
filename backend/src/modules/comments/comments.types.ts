export interface Comment {
  id: string;
  incidentId: string;
  userId: string;
  content: string;
  createdAt: Date;
}

export interface CreateCommentDto {
  content: string;
}
