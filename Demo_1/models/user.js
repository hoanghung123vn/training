var request = require('../common/database');

var getAllUser = () => {
    try {
        var result = request.getRequest.query('select * from account');
        return result;
    } catch (err) {
        console.log(err);
    }
};

module.exports = getAllUser();