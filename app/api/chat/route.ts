import { groq } from '@ai-sdk/groq';
import { convertToModelMessages, streamText } from 'ai';
import { UIMessage } from '@/lib/types/ai';
export async function POST(req: Request) {
    const { messages }: { messages: UIMessage[] } = await req.json();

    const result = streamText({
        model: groq('deepseek-r1-distill-llama-70b'),
        // providerOptions: {
        //     groq: {
        //         reasoningFormat: 'parsed',
        //         reasoningEffort: 'default',
        //         parallelToolCalls: true,
        //         user: 'user-123',
        //     },
        // },
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