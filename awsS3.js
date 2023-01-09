const {
    ACCESS_KEY,
    SECRET_KEY,
} = require("./config/key");

// Setting up S3 upload parameters
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY
});

// const params = {
//   Bucket: BUCKET,
//   CreateBucketConfiguration: {
//     LocationConstraint: REGION
//   }
// };

// s3.createBucket(params, function (err, data) {
//   if (err) console.log(err);
//   else console.log('Bucket Created Successfully', data.Location);
// });


module.exports={
    s3
}
