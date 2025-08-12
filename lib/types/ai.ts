import { UIMessage as Message } from 'ai';
import { z } from 'zod';

export const messageMetadataSchema = z.object({
  model: z.string().optional(),
  totalTokens: z.number().optional(),
});

export type MessageMetadata = z.infer<typeof messageMetadataSchema>;

export type UIMessage = Message<MessageMetadata>;