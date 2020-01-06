var rolehelper = require('../models/cms/user');

module.exports = {
    check: function (...allowed) {
        return (request, response, next) => {
            next();
            //rolehelper.getPermission(request.member.Id).then(function (memberPermissions) {
            //    if (typeof (allowed) != "object")
            //        allowed = [allowed];
            //    var isAllowed = null;
            //    if (memberPermissions)
            //        isAllowed = memberPermissions.filter(item => {
            //            return allowed.indexOf(item.PermissionId) >= 0;
            //        });
            //    if (isAllowed && isAllowed.length > 0)
            //        next();
            //    else {
            //        response.json({
            //            success: false,
            //            errorCode: 403,
            //            message: "Forbidden"
            //        });
            //    }
            //}).catch(err => {
            //    console.log(err);
            //    response.json({
            //        success: false,
            //        errorCode: 403,
            //        message: "Forbidden"
            //    });
            //});
        }
    }
}