// var fs = require('fs');

// // AWS setup for s3 bucket
// var s3Config = require('./config').s3;
// var AWS = require('aws-sdk');
// var s3Client = new AWS.S3({
//   accessKeyId: s3Config.accessKey,
//   secretAccessKey: s3Config.secretKey,
//   region: s3Config.region,
// });

// var errorObj = function(code, message) {
//   var newError = {
//     code: code,
//     message: message
//   };

//   return function(sqlQuery, dbErr) {
//     var date = new Date();
//     newError.timestamp = date.toString();

//     // Copy error object.
//     var writeError = JSON.parse(JSON.stringify(newError));

//     if (sqlQuery) {
//       writeError.query = JSON.stringify(sqlQuery);
//     }

//     if (dbErr) {
//       writeError.dbError = dbErr;
//       writeError.dbMessage = dbErr.message;
//     }

//     var fullDate = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();
//     var logsDir = __dirname + '/../../logs';
//     var fileName = logsDir + '/' + fullDate + '_errors.log';

//     var currentDir = fs.readdirSync(logsDir);
//     var numLogs = currentDir.length;

//     if (numLogs >= 10 && currentDir.indexOf(fileName) === -1 && process.env.NODE_ENV === 'production') {
//       // Upload all logs to S3 if we have 10 days worth
//       currentDir.forEach(function(errLog) {
//         var params = {
//           Bucket: s3Config.bucketName + '/logs',
//           Key: errLog,
//           ContentType: 'text/plain',
//           Body: fs.readFileSync(logsDir + '/' + errLog),
//           ServerSideEncryption: 'AES256'
//         };

//         (function (p, e) {
//           s3Client.putObject(p, function(err, data) {
//             if (err) {
//               console.log('Failed to upload log to s3: ', err);
//             } else {
//               fs.unlink(logsDir + '/' + e);
//             }
//           });
//         })(params, errLog);
//       });
//     }

//     fs.appendFile(fileName, '\n' + JSON.stringify(writeError), function (err) {
//       if (err) {
//         console.log('err: ', err);
//         console.log('Could not append to file.');
//       } else {
//         console.log('Logged error into logfile.');
//       }
//     });

//     return newError;
//   };
// };

module.exports = {
  // DB: {
  //   user: {
  //     create: errorObj(1000, 'Database create user error.'),
  //     get: errorObj(1001, 'Database select user error.')
  //   }
  // },

  // API: {
  //   user: {
  //     signup: errorObj(2000, 'API user signup error.'),
  //     login: errorObj(2001, 'API user login error.')
  //   }
  // },

  newError: function(code, message) {
    return {
      code: code,
      message: message
    };
  }
};