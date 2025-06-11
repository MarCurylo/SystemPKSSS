export interface EntityType {
  id: number;
  serviceId: number;
  name: string;
  description?: string;
  createdAt: string;
}

// Vytvareni
export type NewEntityType = Omit<EntityType, 'id' | 'createdAt'>;

// Update
export type UpdateEntityType = Omit<EntityType, 'createdAt'>;