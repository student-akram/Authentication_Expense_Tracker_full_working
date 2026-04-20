require("dotenv").config();
const AWS = require("aws-sdk");

exports.uploadToS3 = async (data, filename) => {

    const s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
        region: process.env.AWS_REGION
    });

    const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: filename,
    Body: data,
    ContentType: "application/json",
    ContentDisposition: "attachment"   // 🔥 THIS IS THE REAL FIX
};

    // Upload file
    await s3.upload(params).promise();

    // Generate signed URL (valid for 5 minutes)
    const signedUrl = s3.getSignedUrl("getObject", {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: filename,
        Expires: 300
    });

    return signedUrl;
};