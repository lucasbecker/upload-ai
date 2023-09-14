import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Label } from "./ui/label";
import { useEffect, useState } from "react";
import { api } from "@/lib/axios";

interface Prompt {
  id: string;
  title: string;
  template: string;
}

type Prompts = Array<Prompt>;

interface Props {
  onSelected: (template: string) => void;
}

export function PromptSelect({ onSelected }: Props) {
  const [prompts, setPrompts] = useState<Prompts | null>(null);

  function handleSelected(promptId: string) {
    const template = prompts?.find((p) => p.id === promptId);

    if (!template) return;

    onSelected(template.template);
  }

  async function getPrompts() {
    const { data } = await api.get("/prompts");

    setPrompts(data);
  }

  useEffect(() => {
    getPrompts();
  }, []);

  return (
    <div className="space-y-2">
      <Label htmlFor="prompt">Prompt</Label>

      <Select onValueChange={handleSelected}>
        <SelectTrigger>
          <SelectValue id="prompt" placeholder="Selecione um prompt..." />
        </SelectTrigger>

        <SelectContent>
          {prompts?.map((prompt) => (
            <SelectItem key={prompt.id} value={prompt.id}>
              {prompt.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
