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
   exports.userSignin = async (req, res, next) => {
        try {
          let validatedBody = checkValidations(req)
          var queryObj = { deleted: false };
          queryObj.email = validatedBody.email;
        //  queryObj.type = validatedBody.type;
          let user = await User.findOne(queryObj);
          if (user) {  
            await user.isValidPassword(validatedBody.password, async function (err, isMatch) {
              if (err) {
                next(err)
              }
              if (isMatch) {
                res.status(200).send({ user, token: generateToken(user.id) });
              } else {
                return next(new ApiError(400, i18n.__('passwordInvalid')));
              }
            })
          }
          else {
            return next(new ApiError(404, i18n.__('userNotFound')));
          }
        } catch (err) { next(err) }
      };