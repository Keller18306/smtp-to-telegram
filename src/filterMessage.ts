import { config } from "../config";

export function filterMessage(message: string) {
    for (const entry of config.filter) {
        if (typeof entry === 'string') {
            message = message.replaceAll(entry, '<HIDDEN>');
        } else {
            message = message.replace(entry, '<HIDDEN>');
        }
    }

    return message.trim();
}

export function splitMessage(message: string) {
    const messages: string[] = [];

    if (message.length > 4096) {
        const parts = message.split('\n');
        const maxParts = Math.ceil(message.length / 4096)

        for (let i = 0; i < maxParts; i++) {
            const start = i * Math.floor(parts.length / 2);
            const end = (i + 1) * Math.floor(parts.length / 2);

            messages.push(parts.slice(start, end).join('\n'));
        }
    } else {
        messages.push(message);
    }

    return messages;
}