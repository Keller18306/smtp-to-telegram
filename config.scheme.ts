import type { FitlerType } from "./src/filterMessage";

export interface Config {
    tg: {
        token: string;
        chatId: number;
        email: string;
    };
    smtp: {
        logger?: boolean;
        serverName: string;
        port: number;
        noAuth?: boolean;
    };
    users: {
        domain: string;
        credentails: {
            username: string;
            password: string;
        }[]
    }
    filter: Array<FitlerType>;
}