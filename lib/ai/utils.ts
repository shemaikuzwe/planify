import { UIMessage } from "../types/ai";

export function convertToUIMessages(messages: UIMessage[]): UIMessage[] {
    return messages.map((message) => ({
        id: message.id,
        role: message.role as 'user' | 'assistant' | 'system',
        parts: message.parts,
    }));
}
