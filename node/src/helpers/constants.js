(function () {
  'use strict';
  module.exports = {
    db: process.env.MONGO_URI,
    mandrill: {
      host: 'https://mandrillapp.com/api/1.0/',
      token: process.env.MANDRILL_API_KEY
    },
    apiTokens: [process.env.API_TOKEN],
    testToken: 'test',
    hashSecret: process.env.HASH_SECRET,
    resetTokenLength: 80,
    minPasswordLength: 5,

    IDRegex:  /^[0-9a-fA-F]{24}$/,
    emailRegex: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
  };
}());

