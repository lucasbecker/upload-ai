import { createReadStream } from "node:fs";

import { FastifyInstance } from "fastify";
import { z } from "zod";

import { prisma } from "../lib/prisma";
import { openai } from "../lib/openai";

const paramsSchema = z.object({
  videoId: z.string().uuid(),
});

const bodySchema = z.object({
  prompt: z.string(),
});

export async function createTranscriptionRoute(app: FastifyInstance) {
  app.post("/videos/:videoId/transcription", async (request) => {
    const { videoId } = paramsSchema.parse(request.params);
    const { prompt } = bodySchema.parse(request.body);

    const video = await prisma.video.findUniqueOrThrow({
      where: {
        id: videoId,
      },
    });

    const file = createReadStream(video.path);

    const response = await openai.audio.transcriptions.create({
      file: file,
      model: "whisper-1",
      language: "pt",
      response_format: "json",
      temperature: 0,
      prompt,
    });

    const transcription = response.text;

    await prisma.video.update({
      where: { id: videoId },
      data: {
        transcription,
      },
    });

    return { transcription };
  });
}
