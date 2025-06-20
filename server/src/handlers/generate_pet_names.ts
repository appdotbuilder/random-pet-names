
import { db } from '../db';
import { petNamesTable } from '../db/schema';
import { type GeneratePetNameInput, type PetName } from '../schema';
import { eq } from 'drizzle-orm';

export async function generatePetNames(input: GeneratePetNameInput): Promise<PetName[]> {
  try {
    // Get pet names from database based on type filter
    const allNames = input.type 
      ? await db.select().from(petNamesTable).where(eq(petNamesTable.type, input.type)).execute()
      : await db.select().from(petNamesTable).execute();
    
    // If no names found in database, use fallback list
    if (allNames.length === 0) {
      const fallbackNames = [
        'Buddy', 'Bella', 'Max', 'Luna', 'Charlie', 'Lucy', 'Cooper', 'Daisy',
        'Milo', 'Lola', 'Bear', 'Sadie', 'Rocky', 'Molly', 'Zeus', 'Sophie',
        'Duke', 'Chloe', 'Jack', 'Ruby', 'Oscar', 'Penny', 'Leo', 'Zoe'
      ];
      
      const results: PetName[] = [];
      const count = input.count;
      const type = input.type || 'other';
      
      for (let i = 0; i < count; i++) {
        const randomName = fallbackNames[Math.floor(Math.random() * fallbackNames.length)];
        results.push({
          id: Math.floor(Math.random() * 10000), // Placeholder ID for fallback
          name: randomName,
          type: type,
          created_at: new Date()
        });
      }
      
      return results;
    }
    
    // Randomly select names from database results
    const results: PetName[] = [];
    const count = input.count;
    
    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * allNames.length);
      const selectedName = allNames[randomIndex];
      results.push(selectedName);
    }
    
    return results;
  } catch (error) {
    console.error('Generate pet names failed:', error);
    throw error;
  }
}
