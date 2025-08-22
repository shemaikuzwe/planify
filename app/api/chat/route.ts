import { groq } from '@ai-sdk/groq';
import { convertToModelMessages, stepCountIs, streamText, tool } from 'ai';
import { UIMessage } from '@/lib/types/ai';
import { systemPrompt } from '@/lib/ai/system';
import { z } from 'zod';
import { getUserPages, getUserTasks, saveChatData } from '@/lib/ai/data';
import { addTask } from '@/lib/ai/action';
export async function POST(req: Request) {
    const { messages, id }: { messages: UIMessage[], id: string } = await req.json();
    const coreMessage = convertToModelMessages(messages)
    const result = streamText({
        model: groq('openai/gpt-oss-120b'),
        system: systemPrompt,
        providerOptions: {
            groq: {
                reasoningFormat: 'hidden',
                reasoningEffort: 'medium',
                parallelToolCalls: true,
            },
        },
        prompt: coreMessage,
        stopWhen: stepCountIs(10),
        tools: {
            getTasks: tool({
                description: "List tasks for a specific page,if no page provided list all tasks. ",
                inputSchema: z.object({
                    pageName: z.string().optional().describe("The name of the page or empty for all tasks"),
                }),
                execute: async ({ pageName }) => {
                    console.log("Calling tool getUserTasks", pageName);
                    const tasks = await getUserTasks(pageName);
                    console.log("getUserTasks", tasks);
                    return tasks;
                }
            }),
            createTask: tool({
                description: "create a new task for a specific page use TODO as default status",
                inputSchema: z.object({
                    statusId: z.string().describe("The id of the status default TODO status id "),
                    task: z.object({
                        text: z.string().describe("The text(title) of the task"),
                        description: z.string().optional().describe("The description of the task marked down"),
                        tags: z.array(z.string()).optional().describe("The tags of the task"),
                        dueDate: z.string().optional().describe("The due date of the task"),
                    })
                }),
                execute: async ({ statusId, task }) => {
                    console.log("Calling tool addTask", statusId, task);
                    const newTask = await addTask({ statusId, task })
                    return newTask;
                }
            }),
            getPages: tool({
                description: "List all user pages info page name and number of tasks in each page or get a specific page info page name and number of tasks in each page",
                inputSchema: z.object({
                    pageName: z.string().optional().describe("The name of the page")
                }),
                execute: async ({ pageName }) => {
                    console.log("Calling tool getUserPages", pageName);
                    const pages = await getUserPages(pageName);
                    return pages;
                }
            })
        },
    });
    return result.toUIMessageStreamResponse({
        onFinish: async ({ messages }) => {
            await saveChatData(id, messages)
        },
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