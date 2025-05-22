
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';

interface AIContentGeneratorProps {
  onContentGenerated: (content: string) => void;
  placeholder?: string;
  label?: string;
  defaultPrompt?: string;
  maxTokens?: number;
  temperature?: number;
}

const AIContentGenerator = ({
  onContentGenerated,
  placeholder = "Generated content will appear here...",
  label = "Generate content with AI",
  defaultPrompt = "Write a professional description for a portfolio project",
  maxTokens = 800,
  temperature = 0.7
}: AIContentGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState(defaultPrompt);
  const [generatedContent, setGeneratedContent] = useState("");

  const generateContent = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-with-gemini', {
        body: { 
          prompt,
          maxTokens,
          temperature 
        }
      });

      if (error) throw new Error(error.message);
      
      const content = data.generatedText;
      setGeneratedContent(content);
      
      // Notify parent component
      onContentGenerated(content);
      
      toast.success("Content generated successfully!");
    } catch (error) {
      console.error("Error generating content:", error);
      toast.error("Failed to generate content. Please try again later.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUseContent = () => {
    if (generatedContent) {
      onContentGenerated(generatedContent);
      toast.success("Content applied!");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          {label}
        </CardTitle>
        <CardDescription>
          Use AI to generate professional content for your projects
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Prompt</label>
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="What kind of content do you need?"
            disabled={isGenerating}
            className="bg-background"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Generated Content</label>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setGeneratedContent("")}
              disabled={!generatedContent || isGenerating}
            >
              Clear
            </Button>
          </div>
          <Textarea
            value={generatedContent}
            onChange={(e) => setGeneratedContent(e.target.value)}
            placeholder={placeholder}
            disabled={isGenerating}
            className="min-h-[200px] bg-background"
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          onClick={generateContent}
          disabled={isGenerating || !prompt.trim()}
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate
            </>
          )}
        </Button>
        
        <Button
          variant="outline"
          onClick={handleUseContent}
          disabled={isGenerating || !generatedContent}
        >
          Use Content
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AIContentGenerator;
