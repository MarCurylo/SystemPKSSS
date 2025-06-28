import { AttributeEnumValue } from "../AttributeDefinitionEnumValues/attributeEnumValuesModel.js";
export type AttributeDataType =
  | "String"
  | "Number"
  | "Date"
  | "Boolean"
  | "Enum"
  | "File"
  | "Image";

  export const ATTRIBUTE_TYPE_OPTIONS = [
  { value: "String", label: "Text" },
  { value: "Number", label: "Číslo" },
  { value: "Date", label: "Datum" },
  { value: "Boolean", label: "Ano/Ne" },
  { value: "Enum", label: "Výběr z možností" },
  { value: "File", label: "Soubor" },
  { value: "Image", label: "Obrázek" },
];

export interface AttributeDefinition {
  id: number;
  entityTypeId: number;
  name?: string;
  displayName?: string;
  attributeType: AttributeDataType;
  enumValues?: AttributeEnumValue[];
  isRequired: boolean;
  orderIndex: number;
  createdAt: string;
}

export type NewAttributeDefinition = Omit<AttributeDefinition, 'id' | 'createdAt'>;

export interface EntityAttributeValue {
  id: number;
  attributeDefinitionId: number;
  value: string;
}