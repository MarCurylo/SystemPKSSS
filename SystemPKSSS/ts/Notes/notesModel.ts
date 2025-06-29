export interface Note {
  id: number;
  entityId: number;
  text: string;
  authorUserId?: number | null;
  createdAt: string;
  updatedAt?: string | null;
}

export interface CreateNote {
  text: string;
  authorUserId?: number | null;
}

export interface UpdateNote {
  text: string;
}
