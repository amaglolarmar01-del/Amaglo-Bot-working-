const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const express = require('express');
const app = express();
let qrData = null;
let status = 'Starting...';

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { args: ['--no-sandbox','--disable-setuid-sandbox'] }
});

client.on('qr', async qr => {
  qrData = await qrcode.toDataURL(qr);
  status = 'QR Ready - Scan now';
  console.log('QR ready');
});

client.on('ready', () => {
  status = 'BOT CONNECTED ✅';
  qrData = null;
  console.log('Ready');
});

client.initialize();
client.on('message', m => { if(m.body === '!ping') m.reply('pong ✅ Bot working'); });

app.get('/', (req,res)=>{
  if(qrData) res.send(`<center><h2>Scan QR with WhatsApp</h2><img src="${qrData}" width="300"><br><br><a href="/">Refresh</a></center>`);
  else res.send(`<center><h1>${status}</h1><p>Keep this page open</p></center>`);
});
app.listen(process.env.PORT || 3000);
