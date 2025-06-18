export interface AttributeEnumValue {
  id: number;
  attributeDefinitionId: number;
  value: string;
  displayOrder?: number;
}

// export type NewEntityType = Omit<EntityType, 'id' | 'createdAt'>;
// export type UpdateEntityType = Omit<EntityType, 'createdAt'>;
