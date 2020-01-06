var _ = require('lodash');
var authenticate = require('../../middleware/authenticate');
var response = require('../core/response');
const S3Upload = require('../core/file-upload');

module.exports.run = function (app, io) {
	app.post('/upload', S3Upload.array('files', 3), function (req, res, next) {
		var files = [];
		if (req.files && req.files.length > 0) {
			req.files.forEach(function (f) {
				files.push(f.location);
			});
		}
		res.send(response.success(files))
	})
}