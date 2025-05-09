
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { UploadCloud, Sparkles, Loader2, Trash2, Wand2 } from 'lucide-react';
import { useState, useTransition } from 'react';
import type { GenerateFullStoryCharacterOutput} from '@/ai/flows/generate-full-story-character';
import { conjureNewCharacterStory } from '@/lib/actions';

const createStoryFormSchema = z.object({
  characterName: z.string().min(3, "Character name must be at least 3 characters.").max(50, "Character name cannot exceed 50 characters."),
  storyTeaser: z.string().min(10, "Story teaser must be at least 10 characters.").max(250, "Story teaser cannot exceed 250 characters."),
  playerQuest: z.string().min(10, "Player's quest must be at least 10 characters.").max(500, "Player's quest cannot exceed 500 characters."),
  aiDefinition: z.string().min(50, "AI definition must be at least 50 characters.").max(5000, "AI definition cannot exceed 5000 characters."),
  initialGreeting: z.string().min(5, "Initial greeting must be at least 5 characters.").max(300, "Initial greeting cannot exceed 300 characters."),
  suggestedQuestion1: z.string().max(150, "Suggested question cannot exceed 150 characters.").optional().or(z.literal('')),
  suggestedQuestion2: z.string().max(150, "Suggested question cannot exceed 150 characters.").optional().or(z.literal('')),
  suggestedQuestion3: z.string().max(150, "Suggested question cannot exceed 150 characters.").optional().or(z.literal('')),
  // mainStoryImage will be handled separately
  imageHint: z.string().optional().describe("A hint for the main story image, used by AI if generating."),
});

export type CreateStoryFormValues = z.infer<typeof createStoryFormSchema>;

export default function CreateStoryForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [isConjuring, setIsConjuring] = useState(false);
  const [themeKeywords, setThemeKeywords] = useState('');
  const [generatedImageHint, setGeneratedImageHint] = useState<string | null>(null);


  const form = useForm<CreateStoryFormValues>({
    resolver: zodResolver(createStoryFormSchema),
    defaultValues: {
      characterName: '',
      storyTeaser: '',
      playerQuest: '',
      aiDefinition: '',
      initialGreeting: '',
      suggestedQuestion1: '',
      suggestedQuestion2: '',
      suggestedQuestion3: '',
      imageHint: '',
    },
  });

  const onSubmit: SubmitHandler<CreateStoryFormValues> = async (data) => {
    // Placeholder for actual submission logic
    console.log('Form data submitted:', data);
    // const mainStoryImageFile = (document.getElementById('mainStoryImage') as HTMLInputElement)?.files?.[0];
    // if (mainStoryImageFile) {
    //   console.log('Image to upload:', mainStoryImageFile);
    //   // Handle file upload here, e.g., to Firebase Storage
    // }

    toast({
      title: 'Story Definition Saved (Simulated)',
      description: 'The AI character and story details have been processed.',
    });
    // Potentially navigate away or reset form after successful submission
    // router.push('/admin/dashboard'); // Example
  };

  const handleConjureStory = () => {
    setIsConjuring(true);
    setGeneratedImageHint(null);
    startTransition(async () => {
      const result = await conjureNewCharacterStory({ themeKeywords: themeKeywords || undefined });
      if (result.success && result.data) {
        const { imageHint, ...formData } = result.data;
        form.reset(formData); // Populate form with generated data
        if (imageHint) {
          setGeneratedImageHint(imageHint);
          form.setValue('imageHint', imageHint); // Also set in form if needed for submission
        }
        toast({
          title: 'AI Story Conjured!',
          description: 'The form has been populated with the generated story details.',
        });
      } else {
        toast({
          title: 'Conjuring Failed',
          description: result.error || 'Could not generate AI story. Please try again.',
          variant: 'destructive',
        });
      }
      setIsConjuring(false);
    });
  };

  const handleDiscardAndRegenerate = () => {
    form.reset(); // Clear existing form data
    setGeneratedImageHint(null);
    handleConjureStory(); // Conjure new story
  };
  
  const hasGeneratedContent = !!form.formState.dirtyFields.characterName; // Check if form has been populated by AI

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Define New AI Character & Story</h1>
          <p className="text-muted-foreground">Fill in the details below or use the AI generator to bring a new interactive story to life.</p>
        </div>
        <div className="flex space-x-2 self-end sm:self-center">
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" form="create-story-form" disabled={isPending || form.formState.isSubmitting}>
            { (isPending || form.formState.isSubmitting) ? 'Saving...' : 'Save Story'}
          </Button>
        </div>
      </div>

      <Card className="shadow-lg rounded-xl border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-6 w-6 text-accent" />
            AI Story Generator
          </CardTitle>
          <CardDescription>
            Optionally provide a theme or keywords, then let AI conjure a character and story setup for you.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="themeKeywords">Theme/Keywords (Optional)</Label>
            <Input 
              id="themeKeywords"
              placeholder="e.g., 'friendly alien AI,' 'haunted artifact AI'" 
              value={themeKeywords}
              onChange={(e) => setThemeKeywords(e.target.value)}
              disabled={isConjuring}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={handleConjureStory} disabled={isConjuring} className="w-full sm:w-auto">
              {isConjuring ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Conjuring...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  {hasGeneratedContent ? 'Regenerate with Theme' : 'Magic Button'}
                </>
              )}
            </Button>
            {hasGeneratedContent && (
               <Button onClick={handleDiscardAndRegenerate} variant="outline" disabled={isConjuring} className="w-full sm:w-auto">
                {isConjuring ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="mr-2 h-4 w-4" />
                )}
                Discard & Regenerate
              </Button>
            )}
          </div>
        </CardContent>
      </Card>


      <Form {...form}>
        <form id="create-story-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="shadow-lg rounded-xl border">
            <CardHeader>
              <CardTitle>Core AI Character Details</CardTitle>
              <CardDescription>Define the fundamental aspects of your AI character.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="characterName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>AI Character Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Elara, the Star Whisperer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="initialGreeting"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>AI's Initial Greeting Message</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Greetings, traveler. The stars have foretold your arrival." {...field} />
                    </FormControl>
                    <FormDescription>The first message the user sees from this AI.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className="shadow-lg rounded-xl border">
            <CardHeader>
              <CardTitle>Story & Interaction Setup</CardTitle>
              <CardDescription>Craft the narrative elements and user's role.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="storyTeaser"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Story Teaser / Caption for Feed</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="A brief, enticing summary for the story feed card. Max 250 characters."
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="playerQuest"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Player's Quest / Goal with this AI</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe what the user should aim to achieve or discover through interacting with this AI. Max 500 characters."
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
          <Card className="shadow-lg rounded-xl border">
            <CardHeader>
              <CardTitle>AI Character Definition (Base Prompt)</CardTitle>
              <CardDescription>
                This is the core instruction for the AI. Define its personality, knowledge, conversational style, and specific goals or information it should convey or seek. Be detailed.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="aiDefinition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">AI Character Definition (Base Prompt)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Example: Elara is an ancient, wise, mystical being who guides the player to find the Heart of the Cosmos. She speaks poetically, knows much about celestial events, and her primary goal is to test the player's worthiness..."
                        rows={10}
                        className="text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className="shadow-lg rounded-xl border">
            <CardHeader>
              <CardTitle>Visuals & Guidance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
               <FormItem>
                <FormLabel htmlFor="mainStoryImage">Upload Main Story Image</FormLabel>
                 {generatedImageHint && (
                    <FormDescription className="text-accent italic">
                      AI Suggested Image Hint: "{generatedImageHint}" (Use this to find or create an image)
                    </FormDescription>
                  )}
                <FormControl>
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="mainStoryImage"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted transition-colors"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                      </div>
                      <Input id="mainStoryImage" type="file" className="hidden" accept="image/*" />
                    </label>
                  </div>
                </FormControl>
                <FormDescription>This image will be featured on the story feed and chat screen.
                 
                </FormDescription>
                 <FormField
                    control={form.control}
                    name="imageHint"
                    render={({ field }) => (
                      <FormItem className="hidden">
                        <FormLabel>Image Hint (for AI)</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
              </FormItem>

              <div>
                <FormLabel>Suggested Player Questions (Optional)</FormLabel>
                <FormDescription className="mb-2">
                  Provide up to 3 questions to guide users if they need a hint. AI may also generate these.
                </FormDescription>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="suggestedQuestion1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="sr-only">Suggested Question 1</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., What can you tell me about the ancient prophecy?" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="suggestedQuestion2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="sr-only">Suggested Question 2</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., How can I help you lift the curse?" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="suggestedQuestion3"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="sr-only">Suggested Question 3</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Where should I look for the first clue?" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end space-x-2 pt-4">
             <Button variant="outline" onClick={() => router.back()} type="button" disabled={isConjuring || form.formState.isSubmitting || isPending}>
                Cancel
            </Button>
            <Button type="submit" disabled={isConjuring || form.formState.isSubmitting || isPending}>
                {(isConjuring || form.formState.isSubmitting || isPending) ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : 'Save Story'}
            </Button>
          </div>

        </form>
      </Form>
    </div>
  );
}

