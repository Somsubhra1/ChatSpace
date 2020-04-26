const moment = require("moment");

module.exports = formatMessage = (username, text) => ({
    username,
    text,
    time: moment().format("h:mm a"),
});
