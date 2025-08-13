import { groq } from '@ai-sdk/groq';
import { convertToModelMessages, streamText } from 'ai';
import { UIMessage } from '@/lib/types/ai';
import { systemPrompt } from '@/lib/ai/system';
export async function POST(req: Request) {
    const { messages }: { messages: UIMessage[] } = await req.json();

    const result = streamText({
        model: groq('deepseek-r1-distill-llama-70b'),
        system: systemPrompt,
        providerOptions: {
            groq: {
                reasoningFormat: 'hidden',
            },
        },
        prompt: convertToModelMessages(messages),
    });
    return result.toUIMessageStreamResponse({
        originalMessages: messages,
        messageMetadata: ({ part }) => {
            if (part.type === 'finish') {
                return {
                    totalTokens: part.totalUsage.totalTokens,
                };
            }
        }
    })

}