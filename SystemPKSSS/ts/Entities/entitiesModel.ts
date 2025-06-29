export interface EntityAttributeValue {
  attributeDefinitionId: number;
  valueString?: string;
  valueNumber?: number;
  valueDate?: string;
  valueBoolean?: boolean;
}

export interface Entity {
  id: number;
  entityTypeId: number;
  serviceId: number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  attributeValues: EntityAttributeValue[];
}

export interface CreateEntity {
  attributeValues: EntityAttributeValue[];
}
