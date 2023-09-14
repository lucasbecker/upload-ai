import {
  ChangeEvent,
  FormEvent,
  Fragment,
  ReactNode,
  useMemo,
  useRef,
  useState,
} from "react";
import { CheckCircle, FileVideo, Loader2, Upload, XCircle } from "lucide-react";

import { getFFmpeg } from "@/lib/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import { api } from "@/lib/axios";

import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Label } from "./ui/label";

type Status =
  | "waiting"
  | "converting"
  | "uploading"
  | "generating"
  | "success"
  | "error";

const statusMessage: Record<Status, string> = {
  waiting: "Carregar vídeo",
  converting: "Convertendo...",
  uploading: "Carregando...",
  generating: "Transcrevendo...",
  success: "Sucesso",
  error: "Tente novamente mais tarde.",
};

const statusIcon: Record<Status, ReactNode> = {
  waiting: <Upload className="h-4 w-4 ml-2" />,
  converting: <Loader2 className="h-4 w-4 ml-2 animate-spin" />,
  uploading: <Loader2 className="h-4 w-4 ml-2 animate-spin" />,
  generating: <Loader2 className="h-4 w-4 ml-2 animate-spin" />,
  success: <CheckCircle className="h-4 w-4 ml-2" />,
  error: <XCircle className="h-4 w-4 ml-2" />,
};

interface Props {
  onVideoUploaded: (id: string) => void;
}

export function VideoInputForm({ onVideoUploaded }: Props) {
  const [status, setStatus] = useState<Status>("waiting");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const promptInputRef = useRef<HTMLTextAreaElement>(null);

  async function convertVideoToAudio(video: File) {
    console.info("Convert started...");

    const ffmpeg = await getFFmpeg();

    await ffmpeg.writeFile("input.mp4", await fetchFile(video));

    ffmpeg.on("progress", (progress) =>
      console.info("Convert progress: " + Math.round(progress.progress * 100))
    );

    await ffmpeg.exec([
      "-i",
      "input.mp4",
      "-map",
      "0:a",
      "-b:a",
      "20k",
      "-acodec",
      "libmp3lame",
      "output.mp3",
    ]);

    const data = await ffmpeg.readFile("output.mp3");

    const audioFileBlob = new Blob([data], { type: "audio/mpeg" });
    const audioFile = new File([audioFileBlob], "audio.mp3", {
      type: "audio/mpeg",
    });

    console.info("Convert finished.");

    return audioFile;
  }

  function handleFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.currentTarget;

    if (!files || !files.item(0)) return;

    setVideoFile(files.item(0));
  }

  async function handleUploadVideo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!videoFile) return;

    try {
      setStatus("converting");

      const audioFile = await convertVideoToAudio(videoFile);

      const data = new FormData();
      data.append("file", audioFile);

      setStatus("uploading");

      const response = await api.post("/videos", data);
      const videoId = response.data.id;
      onVideoUploaded(videoId);

      setStatus("generating");

      const prompt = promptInputRef.current?.value;
      await api.post(`/videos/${videoId}/transcription`, { prompt });

      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  const previewURL = useMemo(
    () => (videoFile ? URL.createObjectURL(videoFile) : null),
    [videoFile]
  );

  return (
    <form className="space-y-6" onSubmit={handleUploadVideo}>
      <label
        htmlFor="video"
        className="relative flex flex-col items-center justify-center gap-3 border rounded-md border-dashed aspect-video cursor-pointer text-sm text-muted-foreground hover:bg-primary/5"
      >
        {previewURL ? (
          <video
            src={previewURL}
            controls={false}
            className="pointer-events-none absolute inset-0"
          />
        ) : (
          <Fragment>
            <FileVideo className="h-6 w-6" />
            Selecione um vídeo
          </Fragment>
        )}
      </label>

      <input
        type="file"
        id="video"
        accept="video/mp4"
        className="sr-only"
        onChange={handleFileSelected}
        disabled={status !== "waiting"}
      />

      <div className="space-y-2">
        <Label htmlFor="transcription-prompt">Prompt de transcrição</Label>

        <Textarea
          ref={promptInputRef}
          disabled={status !== "waiting"}
          id="transcription-prompt"
          className="h-20 leading-relaxed resize-none"
          placeholder="Inclua palavras-chave mencionadas no vídeo separadas por vírgula (,)"
        />
      </div>

      <Button
        disabled={status !== "waiting"}
        data-success={status === "success"}
        className="w-full data-[success=true]:bg-emerald-400"
        type="submit"
      >
        {statusMessage[status]}

        {statusIcon[status]}
      </Button>
    </form>
  );
}
