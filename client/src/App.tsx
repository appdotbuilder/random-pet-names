
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { trpc } from '@/utils/trpc';
import { useState, useCallback } from 'react';
import type { PetName, GeneratePetNameInput } from '../../server/src/schema';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

type PetType = 'dog' | 'cat' | 'bird' | 'fish' | 'rabbit' | 'hamster' | 'other';

function App() {
  const [generatedNames, setGeneratedNames] = useState<PetName[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('');
  const [nameCount, setNameCount] = useState<number>(3);
  const { theme, setTheme } = useTheme();

  const generateNames = useCallback(async () => {
    setIsLoading(true);
    try {
      const input: GeneratePetNameInput = {
        count: nameCount,
        ...(selectedType && selectedType !== 'any' ? { type: selectedType as PetType } : {})
      };
      
      const result = await trpc.generatePetNames.query(input);
      setGeneratedNames(result);
    } catch (error) {
      console.error('Failed to generate pet names:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedType, nameCount]);

  const petTypeEmojis: Record<string, string> = {
    dog: '🐶',
    cat: '🐱',
    bird: '🐦',
    fish: '🐠',
    rabbit: '🐰',
    hamster: '🐹',
    other: '🐾'
  };

  const getPetTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      dog: 'Dog',
      cat: 'Cat',
      bird: 'Bird',
      fish: 'Fish',
      rabbit: 'Rabbit',
      hamster: 'Hamster',
      other: 'Other'
    };
    return labels[type] || 'Other';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-purple-950 p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8 relative">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            🐾 Pet Name Generator 🐾
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Find the perfect name for your furry, feathered, or finned friend!
          </p>
          
          {/* Theme Toggle Button */}
          <div className="absolute top-0 right-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'light' ? 'dark' : (theme === 'dark' ? 'system' : 'light'))}
              className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : (theme === 'dark' ? <Sun className="h-5 w-5" /> : <div className="h-5 w-5 flex items-center justify-center text-xs">A</div>)}
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </div>

        {/* Controls */}
        <Card className="mb-8 shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-gray-700 dark:text-gray-200">
              ✨ Generate Names ✨
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Pet Type 🐶
                </label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="bg-white dark:bg-gray-700 dark:text-gray-200">
                    <SelectValue placeholder="Any pet type" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-700 dark:text-gray-200">
                    <SelectItem value="any">✨ Any Pet Type</SelectItem>
                    <SelectItem value="dog">🐶 Dog</SelectItem>
                    <SelectItem value="cat">🐱 Cat</SelectItem>
                    <SelectItem value="bird">🐦 Bird</SelectItem>
                    <SelectItem value="fish">🐠 Fish</SelectItem>
                    <SelectItem value="rabbit">🐰 Rabbit</SelectItem>
                    <SelectItem value="hamster">🐹 Hamster</SelectItem>
                    <SelectItem value="other">🐾 Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Number of Names 🔢
                </label>
                <Select value={nameCount.toString()} onValueChange={(value) => setNameCount(parseInt(value))}>
                  <SelectTrigger className="bg-white dark:bg-gray-700 dark:text-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-700 dark:text-gray-200">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} name{num > 1 ? 's' : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="text-center">
              <Button 
                onClick={generateNames} 
                disabled={isLoading}
                size="lg"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-8 py-3 rounded-full shadow-lg transform transition hover:scale-105"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating Magic...
                  </>
                ) : (
                  <>🎲 Generate Pet Names 🎲</>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Generated Names */}
        {generatedNames.length > 0 && (
          <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-gray-700 dark:text-gray-200">
                🎉 Your Generated Names 🎉
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {generatedNames.map((petName: PetName, index: number) => (
                  <div 
                    key={`${petName.id}-${index}`}
                    className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 p-4 rounded-xl border-2 border-gray-100 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-500 transition-colors shadow-sm hover:shadow-md transform hover:scale-105 transition-transform"
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">
                        {petTypeEmojis[petName.type] || '🐾'}
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                        {petName.name}
                      </h3>
                      <Badge 
                        variant="secondary" 
                        className="bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-800 dark:text-purple-200 dark:hover:bg-purple-700"
                      >
                        {getPetTypeLabel(petName.type)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              
              <Separator className="my-6 dark:bg-gray-700" />
              
              <div className="text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  💡 Tip: Click "Generate Pet Names" again for more options!
                </p>
                <Button 
                  onClick={generateNames} 
                  disabled={isLoading}
                  variant="outline"
                  className="border-purple-300 text-purple-600 hover:bg-purple-50 dark:border-purple-600 dark:text-purple-400 dark:hover:bg-purple-900"
                >
                  🔄 Generate More Names
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Welcome message when no names generated yet */}
        {generatedNames.length === 0 && (
          <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardContent className="text-center py-12">
              <div className="text-6xl mb-4">🐾</div>
              <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Ready to Find the Perfect Name?
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Choose your pet type and number of names, then click the generate button above!
              </p>
              <div className="flex justify-center space-x-4 text-4xl">
                <span>🐶</span>
                <span>🐱</span>
                <span>🐦</span>
                <span>🐠</span>
                <span>🐰</span>
                <span>🐹</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 dark:text-gray-400">
          <p className="text-sm">
            Made with ❤️ for pet lovers everywhere
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
