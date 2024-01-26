import aws from "aws-sdk"
import multer from "multer"
require("dotenv").config()


export const s3 = new aws.S3({
    accessKeyId:process.env.AWS_ACCESS_KEY,
    secretAccessKey:process.env.AWS_SECRET_KEY,
    region:process.env.AWS_BUCKET_REGION,
})

export const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024, // limit file size to 5MB
    },
})