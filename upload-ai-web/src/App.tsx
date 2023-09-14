import { useState } from "react";
import { useCompletion } from "ai/react";
import { Github, Wand2 } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { Separator } from "./components/ui/separator";
import { Textarea } from "./components/ui/textarea";
import { Slider } from "./components/ui/slider";
import { Button } from "./components/ui/button";
import { Label } from "./components/ui/label";

import { VideoInputForm } from "./components/video-input-form";
import { ThemeProvider } from "./components/theme-provider";
import { PromptSelect } from "./components/prompt-select";
import { ModeToggle } from "./components/mode-toggle";

export function App() {
  const [temperature, setTemperature] = useState<number>(0.5);
  const [videoId, setVideoId] = useState<string | null>(null);

  const {
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    completion,
    isLoading,
  } = useCompletion({
    api: import.meta.env.VITE_API_URL + "/ai/completion",
    body: {
      videoId,
      temperature,
    },
    headers: {
      "Content-type": "application/json",
    },
  });

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <div className="min-h-screen flex flex-col">
        <header className="px-6 py-3 flex items-center justify-between border-b">
          <h1 className="text-xl font-bold">upload.ai</h1>

          <div className="flex items-center gap-3">
            <ModeToggle />

            <Button variant="outline" className="h-9 w-9">
              <Github className="absolute h-[1.2rem] w-[1.2rem]" />

              <span className="sr-only">Github</span>
            </Button>
          </div>
        </header>

        <main className="flex-1 p-6 flex gap-6">
          <section className="flex flex-col flex-1 gap-4">
            <div className="grid grid-rows-2 gap-4 flex-1">
              <Textarea
                className="resize-none p-4 leading-relaxed"
                placeholder="Inclua o prompt para a IA..."
                value={input}
                onChange={handleInputChange}
              />

              <Textarea
                className="resize-none p-4 leading-relaxed"
                placeholder="Resultado gerado pela IA..."
                readOnly
                value={completion}
              />
            </div>

            <p className="text-sm text-muted-foreground">
              Lembre-se: você pode utilizar a variável
              <code className="text-secondary-foreground">
                {" {transcription} "}
              </code>
              no seu prompt para adicionar o conteúdo da transcrição do vídeo
              selecionado.
            </p>
          </section>

          <aside className="w-80 space-y-6">
            <VideoInputForm onVideoUploaded={setVideoId} />

            <Separator />

            <form className="space-y-6" onSubmit={handleSubmit}>
              <PromptSelect onSelected={setInput} />

              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>

                <Select defaultValue="gpt-3.5" disabled>
                  <SelectTrigger>
                    <SelectValue id="model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-3.5">GPT 3.5-turbo 16k</SelectItem>
                  </SelectContent>
                </Select>

                <span className="block text-sm text-muted-foreground italic">
                  Você poderá customizar essa opção em breve.
                </span>
              </div>

              <div className="space-y-4">
                <Label htmlFor="temperature">Temperatura</Label>

                <Slider
                  id="temperature"
                  min={0}
                  max={1}
                  step={0.1}
                  value={[temperature]}
                  onValueChange={(value) => setTemperature(value[0])}
                />

                <span className="block text-sm text-muted-foreground italic">
                  Quanto maior o valor, mais criativo o resultado mas sujeito a
                  erros.
                </span>
              </div>

              <Button disabled={isLoading} type="submit" className="w-full">
                Executar <Wand2 className="h-4 w-4 ml-2" />
              </Button>
            </form>
          </aside>
        </main>
      </div>
    </ThemeProvider>
  );
}
