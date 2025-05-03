"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Wand2 } from "lucide-react";
import { Input } from "./ui/input";

interface ImagePromptInputProps {
  onSubmit: (prompt: string, backstory: string) => void;
  isEditing: boolean;
  isLoading: boolean;
}

export function ImagePromptInput({
  onSubmit,
  isEditing,
  isLoading,
}: ImagePromptInputProps) {
  const [prompt, setPrompt] = useState("");
  const [backstory, setBackstory] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (prompt.trim()) {
      onSubmit(prompt.trim(), backstory.trim());
      setPrompt("");
      setBackstory("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg">
      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">
          {isEditing
            ? "Describe how you want to edit the image/backstory"
            : "Describe the image you want to generate"}
        </p>
      </div>

      <Input
        id="prompt"
        className="border-secondary"
        placeholder={
          isEditing
            ? "Example: Make the background blue and add a rainbow..."
            : "Example: A 3D rendered pig with wings flying over a futuristic city..."
        }
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <label htmlFor="backstory" className="block text-sm font-medium text-foreground">
        Backstory
      </label>
      <Input
        id="backstory"
        className="border-secondary"
        placeholder={
          isEditing
            ? "Example: The pig is now a superhero with a cape..."
            : "Example: The fish's name is Goldie and it has short-term memory disorder..."
        }
        value={backstory}
        onChange={(e) => setBackstory(e.target.value)}
      />

      <Button
        type="submit"
        disabled={!prompt.trim() || isLoading}
        className="w-full bg-primary hover:bg-primary/90"
      >
        <Wand2 className="w-4 h-4 mr-2" />
        {isEditing ? "Edit Image" : "Generate Image"}
      </Button>
    </form>
  );
}
