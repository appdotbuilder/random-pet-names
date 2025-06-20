
import { db } from '../db';
import { petNamesTable } from '../db/schema';
import { type AddPetNameInput, type PetName } from '../schema';

export const addPetName = async (input: AddPetNameInput): Promise<PetName> => {
  try {
    // Insert pet name record
    const result = await db.insert(petNamesTable)
      .values({
        name: input.name,
        type: input.type
      })
      .returning()
      .execute();

    return result[0];
  } catch (error) {
    console.error('Pet name addition failed:', error);
    throw error;
  }
};
