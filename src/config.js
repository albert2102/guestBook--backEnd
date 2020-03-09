const config = {};
config.mongoUrl = 'mongodb://localhost:27017/guest_book'
config.jwtSecret = 'guest_book';
config.App = {Name:'guest_book'}
config.port = 3000;

module.exports = config;