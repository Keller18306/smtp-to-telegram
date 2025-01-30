import { simpleParser } from 'mailparser';
import { SMTPServer } from 'smtp-server';
import { config } from '../config';
import { sendMessage } from './tg';

const smtp = new SMTPServer({
    logger: config.smtp.logger,

    authMethods: ['PLAIN', 'LOGIN'],
    name: config.smtp.serverName,

    // с шифрованием
    // secure: true,
    // key: fs.readFileSync('smtp.key'),
    // cert: fs.readFileSync('smtp.crt'),

    // без шифрования
    secure: false,
    allowInsecureAuth: true,

    // не требовать авторизацию
    authOptional: config.smtp.noAuth,

    onConnect(session, callback) {
        console.log(`[${session.id}] Connect from ${session.clientHostname} (IP: ${session.remoteAddress})`);
        return callback();
    },
    onAuth(auth, session, callback) {
        for (const user of config.users.credentails) {
            if (auth.username === user.username && auth.password === user.password) {
                // AUTH SUCCESS
                console.log(`[${session.id}] Auth success`);

                return callback(null, {
                    user: `${auth.username}@${config.users.domain}`
                });
            }
        }

        console.log(`[${session.id}] Auth failed method:${auth.method} username:${auth.username} password:${auth.password}`);
    },
    onMailFrom(address, session, callback) {
        if (address.address !== session.user) {
            console.log(`[${session.id}] Invalid mailFrom: ${address.address}`);

            return;
        }

        // VALID MAIL
        return callback();
    },
    onRcptTo(address, session, callback) {
        if (session.envelope.rcptTo.length >= 1) {
            return callback(new Error('Only single recepient'));
        }

        if (![config.tg.email].includes(address.address)) {
            console.log(`[${session.id}] Invalid rcptTo: ${address.address}`);

            return;
        }

        // VALID RCPT
        callback();
    },
    onData(stream, session, callback) {
        // console.log('onData', session);

        simpleParser(stream)
            .then((parsed) => {
                if (Array.isArray(parsed.to)) {
                    return callback(new Error('Only single recipient'));
                }

                // if (!parsed.from?.text || !session.envelope.mailFrom || session.envelope.mailFrom.address !== parsed.from?.text) {
                //     return callback(new Error('Invalid from header'));
                // }

                // if (!parsed.to?.text || !session.envelope.rcptTo || session.envelope.rcptTo[0].address !== parsed.to?.text) {
                //     return callback(new Error('Invalid to header'));
                // }

                // debugger;

                console.log('From:', parsed.from?.text);
                console.log('To:', parsed.to?.text);
                console.log('Subject:', parsed.subject);
                console.log('Text:', parsed.text);

                sendMessage([
                    `${session.user} - ${parsed.subject}`,
                    parsed.text
                ].join('\n')).catch(console.error);
            })
            .catch((err) => {
                console.error('Mail parse error:', err);
            })
            .finally(() => callback());
    },
});

smtp.on('error', (err) => {
    console.log('Error', err.message);
});

smtp.listen(config.smtp.port, () => {
    console.log('Listen SMTP:', config.smtp.port);
});