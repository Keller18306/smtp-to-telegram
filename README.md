# SMTP email to Telegram

### To start project

Create config.ts
```typescript
import { Config } from "./config.scheme";

export const config: Config = {
    tg: {
        token: '', // tg bot token
        chatId: -1000000000000, // chatId to receive alerts
        email: 'telegram@smtp.local' // mailTo
    },

    smtp: {
        logger: false, // log all TCP messages
        serverName: 'local.smtp.host', //visual name on server hello
        port: 25,
        noAuth: false // do not use auth by login:pass
    },

    // Auth user with
    // login: test
    // password: test
    // mailFrom: test@smtp.local
    users: {
        domain: 'smtp.local',
        credentails: [
            {
                username: 'test',
                password: 'test'
            }
        ]
    },
    
    // Filter words with string/regexp
    filter: []
}
```

Run following commands:
```bash
npm i -g yarn ts-node
yarn
ts-node .
```