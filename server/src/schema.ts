
import { z } from 'zod';

// Pet name schema
export const petNameSchema = z.object({
  id: z.number(),
  name: z.string(),
  type: z.enum(['dog', 'cat', 'bird', 'fish', 'rabbit', 'hamster', 'other']),
  created_at: z.coerce.date()
});

export type PetName = z.infer<typeof petNameSchema>;

// Input schema for generating pet names
export const generatePetNameInputSchema = z.object({
  type: z.enum(['dog', 'cat', 'bird', 'fish', 'rabbit', 'hamster', 'other']).optional(),
  count: z.number().int().min(1).max(10).default(1)
});

export type GeneratePetNameInput = z.infer<typeof generatePetNameInputSchema>;

// Input schema for adding custom pet names
export const addPetNameInputSchema = z.object({
  name: z.string().min(1).max(50),
  type: z.enum(['dog', 'cat', 'bird', 'fish', 'rabbit', 'hamster', 'other'])
});

export type AddPetNameInput = z.infer<typeof addPetNameInputSchema>;
