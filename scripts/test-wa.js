const { Client, LocalAuth } = require('whatsapp-web.js');

const client = new Client({
    authStrategy: new LocalAuth({ clientId: "zapleads-local" }),
    puppeteer: {
        headless: true,
        executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    },
});

client.on('qr', (qr) => {
    console.log('QR RECEIVED', qr.substring(0, 50) + "...");
    process.exit(0);
});
client.on('ready', () => {
    console.log('Client is ready!');
    process.exit(0);
});
client.on('auth_failure', msg => {
    console.error('AUTHENTICATION FAILURE', msg);
    process.exit(1);
});

client.initialize().catch(err => {
    console.error('INIT ERROR:', err);
    process.exit(1);
});
