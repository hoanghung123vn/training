
const config = require('../../config');
var aws = require('aws-sdk')
var multer = require('multer')
var multerS3 = require('multer-s3')

aws.config.update({
    secretAccessKey: config.awsUpload.secretAccessKey,
    accessKeyId: config.awsUpload.accessKeyId,
    region: config.awsUpload.region,
});
var s3 = new aws.S3()

var upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: config.awsUpload.bucket,
        acl: 'public-read',
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString() + file.originalname)
        }
    })
})
aws.config.update({
    secretAccessKey: config.awsUpload.secretAccessKey,
    accessKeyId: config.awsUpload.accessKeyId,
    region: config.awsUpload.region,
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true)
    } else {
        cb(new Error('Invalid Mime Type, only JPEG and PNG'), false);
    }
}

module.exports = upload;
