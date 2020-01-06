var rolehelper = require('../src/core/rolehelper');

module.exports = {
    check: function ( ...allowed) {
        var memberPermissions = [];
        if (typeof (allowed) != "object")
            allowed = [allowed];
        var isAllowed = null;
        if (memberPermissions)
            isAllowed = memberPermissions.filter(item => {
                return allowed.indexOf(item.id) >= 0;
            });

        return (request, response, next) => {
            if (isAllowed && isAllowed.length > 0)
                next();
            else {
                response.json({
                    success: false,
                    errorCode: 403,
                    message: "Forbidden"
                });
            }
        }
    }
}