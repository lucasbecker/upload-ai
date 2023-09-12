import { FileVideo, Github, Upload, Wand2 } from "lucide-react";

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

import { ThemeProvider } from "./components/theme-provider";
import { ModeToggle } from "./components/mode-toggle";

export function App() {
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
              />

              <Textarea
                className="resize-none p-4 leading-relaxed"
                placeholder="Resultado gerado pela IA..."
                readOnly
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
            <form className="space-y-6">
              <label
                htmlFor="video"
                className="flex flex-col items-center justify-center gap-3 border rounded-md border-dashed aspect-video cursor-pointer text-sm text-muted-foreground hover:bg-primary/5"
              >
                <FileVideo className="h-6 w-6" />
                Selecione um vídeo
              </label>

              <input
                type="file"
                id="video"
                accept="video/mp4"
                className="sr-only"
              />

              <div className="space-y-2">
                <Label htmlFor="transcription-prompt">
                  Prompt de transcrição
                </Label>

                <Textarea
                  id="transcription-prompt"
                  className="h-20 leading-relaxed resize-none"
                  placeholder="Inclua palavras-chave mencionadas no vídeo separadas por vírgula (,)"
                />
              </div>

              <Button className="w-full" type="submit">
                Carregar vídeo <Upload className="h-4 w-4 ml-2" />
              </Button>
            </form>

            <Separator />

            <form className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="prompt">Prompt</Label>

                <Select>
                  <SelectTrigger>
                    <SelectValue
                      id="prompt"
                      placeholder="Selecione um prompt..."
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="title">Título do YouTube</SelectItem>
                    <SelectItem value="description">
                      Descrição do YouTube
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

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
                  defaultValue={[0.5]}
                />

                <span className="block text-sm text-muted-foreground italic">
                  Quanto maior o valor, mais criativo o resultado mas sujeito a
                  erros.
                </span>
              </div>

              <Button type="submit" className="w-full">
                Executar <Wand2 className="h-4 w-4 ml-2" />
              </Button>
            </form>
          </aside>
        </main>
      </div>
    </ThemeProvider>
  );
}
