import { Telegram } from 'puregram';
import { filterMessage, splitMessage } from './filterMessage';
import { config } from '../config';

const tg = new Telegram({
    token: config.tg.token
});

export async function sendMessage(message: string) {
    const filteredMessage = filterMessage(message);
    if (!filteredMessage) return;

    const messages = splitMessage(filteredMessage);

    for (const text of messages) {
        await tg.api.sendMessage({
            chat_id: config.tg.chatId,
            text: text
        });
    }
}