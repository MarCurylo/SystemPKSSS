export interface Tag {
  id: number;
  serviceId: number;
  name: string;
  color: string;
  description?: string;
  createdAt?: string;
}

export interface CreateTag {
  serviceId: number;
  name: string;
  color: string;
  description?: string;
}

export interface EntityTagLink {
  id: number;
  entityId: number;
  tagId: number;
  createdAt?: string;
}

export interface CreateEntityTagLink {
  entityId: number;
  tagId: number;
}
