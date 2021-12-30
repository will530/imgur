const { ImgurClient } = require('../dist/imgur.node');
const { createReadStream } = require('fs');
const { join } = require('path');
require('dotenv').config();

const album = process.env.ALBUM;
const imgur = new ImgurClient({
  accessToken: process.env.ACCESS_TOKEN,
  clientId: process.env.CLIENT_ID,
});

const imageStream = createReadStream(join(__dirname, 'small.jpg'));
const videoStream = createReadStream(join(__dirname, 'small.mp4'));

imgur.upload({ album, image: imageStream, type: 'stream' }).then(console.log);
imgur.upload({ album, image: videoStream, type: 'stream' }).then(console.log);
