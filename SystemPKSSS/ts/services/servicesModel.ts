export interface Service {
  id: number;              
  name: string;
  description?: string;
  isActive: boolean;
  createdAt?: string;
}

// Vytvareni
export type NewService = Omit<Service, 'id' | 'createdAt'>;

// Update
export type UpdateService = Omit<Service, 'createdAt'>;