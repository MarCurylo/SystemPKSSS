export interface EntityType {
  id: number;
  serviceId: number;
  name?: string;
  description?: string;
  visible: boolean;
  editable: boolean;
  exportable: boolean;
  auditable: boolean;
  orderIndex: number;
  createdAt: string;
}

export type NewEntityType = Omit<EntityType, 'id' | 'createdAt' | 'orderIndex'>;
export type UpdateEntityType = Omit<EntityType, 'createdAt' | 'orderIndex'>;
