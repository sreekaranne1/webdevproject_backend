const aws = require("aws-sdk")

const region = "us-west-2"
const bucketName = "webdevs3bucket"
// const accessKeyId = process.env.AWS_ACCESS_KEY_ID
// const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
const accessKeyId = "AKIAWO35CEIUTZ3AU7X7"
const secretAccessKey = "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"

const s3 = new aws.S3({
  region,
  accessKeyId,
  secretAccessKey,
  signatureVersion: 'v4'
})

exports.generateUploadURL= async(req,res,next)=>{

  const imageName = req.params.name
  const params = ({
    Bucket: bucketName,
    Key: imageName,
    Expires: 100
  })
  const uploadURL = await s3.getSignedUrlPromise('putObject', params)
  return uploadURL
}
