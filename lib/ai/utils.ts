import { DBMessage, UIMessage } from "../types/ai";

export function convertToUIMessages(messages: DBMessage[]): UIMessage[] {
    return messages.map((message) => ({
        id: message.id,
        role: message.role as 'user' | 'assistant' | 'system',
        parts: message.parts,
    }));
}
