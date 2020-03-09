var config =require ('../config');
var jwt =require ('jsonwebtoken');


const { jwtSecret } = config;

exports.generateToken = id => {
    return jwt.sign({
        sub: id,
        iss: 'App',
        iat: new Date().getTime()
    }, jwtSecret, { expiresIn: '7d' });
};