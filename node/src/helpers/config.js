module.exports = {
  db: process.env.MONGO_URI,
  mandrill: {
    host: 'https://mandrillapp.com/api/1.0/',
    token: process.env.MANDRILL_API_KEY
  },
  apiTokens: process.env.TEST_TOKEN || [process.env.API_TOKEN],
  hashSecret: process.env.HASH_SECRET
};