export interface EntityType {
  id: number;
  serviceId: number;
  name?: string;
  description?: string;
  visible: boolean;
  editable: boolean;
  exportable: boolean;
  auditable: boolean;
  createdAt: string;
}

export type NewEntityType = Omit<EntityType, 'id' | 'createdAt'>;
export type UpdateEntityType = Omit<EntityType, 'createdAt'>;
