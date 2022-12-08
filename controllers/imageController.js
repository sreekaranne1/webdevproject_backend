const { generateUploadURL } = require("../s3Connection");

exports.s3urlControllers = async (req, res, next) => {
  console.log("s3 called")
  const url =  await generateUploadURL(req, res, next);
  res.json({status:200,url:url})
};
