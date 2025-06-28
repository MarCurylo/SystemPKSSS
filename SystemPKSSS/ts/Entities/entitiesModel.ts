import {EntityAttributeValue, AttributeDefinition} from "../AttributeDefinitions/attributeDefinitionsModel";

export interface Entity {
  id: number;
  entityTypeId: number;
  serviceId: number;
  createdAt: string;
  deletedAt?: string;
  updatedAt: string;

    attributeValues?: EntityAttributeValue[];
}

