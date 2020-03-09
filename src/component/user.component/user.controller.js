var bcrypt = require( "bcryptjs");
var i18n = require( "i18n");
var {checkValidations,handleImg} = require("../../shared.controller");
var { checkExistThenGet, checkExist } = require( "../../Helper/checkMethod");
var ApiError = require( "../../Helper/ApiError");
var { generateToken } = require( '../../utils/token');
const User = require('./user.model');

exports.signup = async(req,res,next)=>{
    try {
        let validatedBody = checkValidations(req);
        if (req.file) {
          let img = await handleImg(req, { attributeName: 'image', isUpdate: false })
          validatedBody.image = img
        } 
        console.log(validatedBody);
        
        let password = validatedBody.password
        let confirmPassword = validatedBody.confirmPassword
        if (password != confirmPassword) {
            return next(new ApiError(400, i18n.__('password mismatch')))
        }
         else{
            const salt = bcrypt.genSaltSync();
            let hash = await bcrypt.hash(validatedBody.password, salt); 
            validatedBody.password = hash;
         }
        let user = await User.create(validatedBody)
        res.status(201).send({ user: user, token: generateToken(user.id) })
      } catch (err) {
        next(err);
      }
};