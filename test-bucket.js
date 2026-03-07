require('dotenv').config();
const { Storage } = require('@google-cloud/storage');

const storage = new Storage({
  projectId: process.env.FIREBASE_PROJECT_ID,
  credentials: {
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }
});

storage.getBuckets().then(x => console.log(x[0].map(b => b.name))).catch(e => console.log(e));
