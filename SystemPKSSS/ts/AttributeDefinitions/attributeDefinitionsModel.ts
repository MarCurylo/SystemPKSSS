export interface AttributeDefinition {
  id: number;
  entityTypeId: number;
  name?: string;
  displayName?: string;
  attributeType: string;
  isRequired: boolean;
  orderIndex: number;
  createdAt: string;
}

// export type NewEntityType = Omit<EntityType, 'id' | 'createdAt'>;
// export type UpdateEntityType = Omit<EntityType, 'createdAt'>;
