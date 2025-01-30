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