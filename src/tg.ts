import { Telegram } from 'puregram';
import { filterMessage } from './filterMessage';
import { config } from '../config';

const tg = new Telegram({
    token: config.tg.token
});

export async function sendMessage(message: string) {
    await tg.api.sendMessage({
        chat_id: config.tg.chatId,
        text: filterMessage(message)
    });
}