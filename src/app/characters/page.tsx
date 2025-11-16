'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Play, 
  BarChart3, 
  Star,
  RefreshCw,
  Film,
  User,
  Settings
} from 'lucide-react';

interface Character {
  id: string;
  code: string;
  ethnicity: string;
  baseAge: number;
  variant: string;
  aestheticType: string;
  isActive: boolean;
  performanceScore: number;
  _count: {
    contents: number;
  };
}

export default function CharactersPage() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(false);

  useEffect(() => {
    fetchCharacters();
  }, []);

  const fetchCharacters = async () => {
    try {
      const response = await fetch('/api/characters');
      const data = await response.json();
      setCharacters(data.characters || []);
    } catch (error) {
      console.error('Error fetching characters:', error);
    } finally {
      setLoading(false);
    }
  };

  const initializeCharacters = async () => {
    setInitializing(true);
    try {
      const response = await fetch('/api/characters/init', {
        method: 'POST'
      });
      const data = await response.json();
      if (response.ok) {
        await fetchCharacters();
      }
    } catch (error) {
      console.error('Error initializing characters:', error);
    } finally {
      setInitializing(false);
    }
  };

  const getEthnicityColor = (ethnicity: string) => {
    switch (ethnicity) {
      case 'korean': return 'bg-blue-100 text-blue-800';
      case 'japanese': return 'bg-red-100 text-red-800';
      case 'chinese': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAestheticIcon = (type: string) => {
    return type === 'cinematic' ? <Film className="w-4 h-4" /> : <User className="w-4 h-4" />;
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const groupCharactersByEthnicity = () => {
    const grouped: Record<string, Character[]> = {
      korean: [],
      japanese: [],
      chinese: []
    };

    characters.forEach(character => {
      if (grouped[character.ethnicity]) {
        grouped[character.ethnicity].push(character);
      }
    });

    return grouped;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <RefreshCw className="w-8 h-8 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  const groupedCharacters = groupCharactersByEthnicity();
  const totalCharacters = characters.length;
  const activeCharacters = characters.filter(c => c.isActive).length;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Characters</h1>
            <p className="text-muted-foreground">
              Manage your AI character roster for content generation
            </p>
          </div>
          <div className="flex items-center gap-2">
            {totalCharacters === 0 && (
              <Button 
                onClick={initializeCharacters}
                disabled={initializing}
                className="gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${initializing ? 'animate-spin' : ''}`} />
                Initialize Characters
              </Button>
            )}
            <Badge variant="outline">{totalCharacters}/18</Badge>
            <Badge variant="secondary">{activeCharacters} active</Badge>
          </div>
        </div>

        {totalCharacters === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-96">
              <Users className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Characters Yet</h3>
              <p className="text-muted-foreground text-center mb-4">
                Initialize your character roster to start generating content with 18 unique AI personalities.
              </p>
              <Button 
                onClick={initializeCharacters}
                disabled={initializing}
                className="gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${initializing ? 'animate-spin' : ''}`} />
                {initializing ? 'Initializing...' : 'Initialize Characters'}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="grid" className="space-y-4">
            <TabsList>
              <TabsTrigger value="grid">Grid View</TabsTrigger>
              <TabsTrigger value="ethnicity">By Ethnicity</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>

            <TabsContent value="grid" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {characters.map((character) => (
                  <Card key={character.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src="" />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {character.code.slice(-2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex items-center gap-1">
                          {getAestheticIcon(character.aestheticType)}
                          <Badge variant={character.isActive ? "default" : "secondary"}>
                            {character.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <h3 className="font-semibold">{character.code}</h3>
                        <p className="text-sm text-muted-foreground capitalize">
                          {character.ethnicity} • Age {character.baseAge} • Variant {character.variant}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge className={getEthnicityColor(character.ethnicity)}>
                          {character.ethnicity}
                        </Badge>
                        <Badge variant="outline">
                          {character.aestheticType}
                        </Badge>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>Performance</span>
                          <span className={`font-medium ${getPerformanceColor(character.performanceScore)}`}>
                            {character.performanceScore.toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Content</span>
                          <span>{character._count.contents} pieces</span>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button size="sm" variant="outline" className="flex-1 gap-1">
                          <Play className="w-3 h-3" />
                          Generate
                        </Button>
                        <Button size="sm" variant="ghost" className="gap-1">
                          <BarChart3 className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="ethnicity" className="space-y-6">
              {Object.entries(groupedCharacters).map(([ethnicity, chars]) => (
                <div key={ethnicity} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge className={getEthnicityColor(ethnicity)} capitalize>
                      {ethnicity}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {chars.length} characters
                    </span>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {chars.map((character) => (
                      <Card key={character.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold">{character.code}</h4>
                              <p className="text-sm text-muted-foreground">
                                Age {character.baseAge} • {character.aestheticType}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className={`font-medium ${getPerformanceColor(character.performanceScore)}`}>
                                {character.performanceScore.toFixed(1)}%
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {character._count.contents} pieces
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="performance" className="space-y-4">
              <div className="space-y-4">
                {characters
                  .sort((a, b) => b.performanceScore - a.performanceScore)
                  .map((character, index) => (
                    <Card key={character.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                              {index + 1}
                            </div>
                            <div>
                              <h4 className="font-semibold">{character.code}</h4>
                              <p className="text-sm text-muted-foreground">
                                {character.ethnicity} • {character.aestheticType}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <Badge className={getEthnicityColor(character.ethnicity)}>
                              {character.ethnicity}
                            </Badge>
                            <div className="text-right">
                              <div className={`font-bold text-lg ${getPerformanceColor(character.performanceScore)}`}>
                                {character.performanceScore.toFixed(1)}%
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {character._count.contents} pieces
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}