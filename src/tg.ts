import { Telegram } from 'puregram';
import { filterMessage, splitMessage } from './filterMessage';
import { config } from '../config';

const tg = new Telegram({
    token: config.tg.token
});

export async function sendMessage(message: string) {
    const messages = splitMessage(message);

    for (const message of messages) {
        await tg.api.sendMessage({
            chat_id: config.tg.chatId,
            text: filterMessage(message)
        });
    }
}