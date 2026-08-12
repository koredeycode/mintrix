import { z } from "zod";

export const startGenerationSchema = z.object({
  layerConfigId: z.string().optional(),
  totalEditions: z.number().int().positive().max(10000).optional().default(10),
  gifExport: z.boolean().optional().default(false),
  gifRepeat: z.number().int().min(0).optional().default(0),
  gifQuality: z.number().int().min(1).max(100).optional().default(100),
  gifDelay: z.number().int().min(10).optional().default(500),
  gifImageCount: z.number().int().min(2).max(100).optional().default(10),
  numberOfGifs: z.number().int().min(1).max(10).optional().default(1),
  shuffleOrder: z.boolean().optional(),
});

export const generationStatusSchema = z.object({
  jobId: z.string(),
  status: z.enum(["queued", "running", "completed", "failed", "cancelled"]),
  progress: z.number().min(0).max(100),
  currentEdition: z.number().optional(),
  totalEditions: z.number(),
});

export type StartGenerationInput = z.infer<typeof startGenerationSchema>;
export type GenerationStatus = z.infer<typeof generationStatusSchema>;
