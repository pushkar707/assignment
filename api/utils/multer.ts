import aws from "aws-sdk"
import multer from "multer"
import multerS3 from "multer-s3";


export const s3 = new aws.S3({
    accessKeyId:'AKIAYYFR7ABM23MBGVNM',
    secretAccessKey:"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",
    region:"ap-south-1",
})

export const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024, // limit file size to 5MB
    },
    // storage: multerS3({
    //     // @ts-ignore
    //     s3:s3,
    //     bucket:"idea-usher-post-images",
    //     acl:"public-read",
    //     contentType: multerS3.AUTO_CONTENT_TYPE,
    //     key: function (req, file, cb) {
    //         cb(null, Date.now().toString() + '-' + file.originalname);
    //     },
    // })
})