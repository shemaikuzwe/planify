import { groq } from '@ai-sdk/groq';
import { convertToModelMessages, stepCountIs, streamText, tool } from 'ai';
import { UIMessage } from '@/lib/types/ai';
import { systemPrompt } from '@/lib/ai/system';
import { z } from 'zod';
import { getUserPages, getUserTasks } from '@/lib/data/task';
import { db } from '@/lib/prisma';
export async function POST(req: Request) {
    const { messages }: { messages: UIMessage[] } = await req.json();

    const result = streamText({
        model: groq('qwen/qwen3-32b'),
        system: systemPrompt,
        providerOptions: {
            groq: {
                reasoningFormat: 'hidden',
                reasoningEffort: 'default',
                parallelToolCalls: true,
            },
        },
        stopWhen: stepCountIs(10),
        tools: {
            getTasks: tool({
                description: "List tasks for a specific page,if no page provided list all tasks. ",
                inputSchema: z.object({
                    pageName: z.string().optional().describe("The name of the page or empty for all tasks"),
                }),
                execute: async ({ pageName }) => {
                    console.log("Calling tool", pageName);
                    return [
                        {
                            id: "1",
                            text: "Task 1",
                            description: "This is a task",
                            tags: ["tag1", "tag2"],
                            dueDate: "2023-01-01",
                        },
                        {
                            id: "2",
                            text: "Task 2",
                            description: "This is another task",
                            tags: ["tag3", "tag4"],
                            dueDate: "2023-01-02",
                        },
                    ];

                    // const tasks = await getUserPages(pageName);
                    // return tasks;
                }
            }),

            createTask: tool({
                description: "create a new task for a specific page",
                inputSchema: z.object({
                    pageName: z.string().describe("The name of the page"),
                    task: z.object({
                        text: z.string().describe("The text(title) of the task"),
                        description: z.string().optional().describe("The description of the task"),
                        tags: z.array(z.string()).optional().describe("The tags of the task"),
                        dueDate: z.string().optional().describe("The due date of the task"),
                    })
                }),
                execute: async ({ pageName, task }) => {
                    const newTask = task
                    return newTask
                }
            })
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