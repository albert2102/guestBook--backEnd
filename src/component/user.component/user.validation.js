var { body } = require( "express-validator/check");
var i18n = require ( "i18n");
var User = require( "./user.model");
var { checkExist } = require( "../../Helper/checkMethod");

module.exports = {
  userSignUp: () => {
    let validation = [
      body('username').trim().not().isEmpty().withMessage(() => { return i18n.__("Username is required"); }).custom(async (value, { req }) => {
        let user = await User.findOne({ deleted: false, username: value, type: req.body.type })
        if (user) throw new Error(i18n.__("username is taken"))
        return true;
      }),
      body('email').isEmail().trim().not().isEmpty().withMessage(() => { return i18n.__("Email is required"); }).custom(async (value, { req }) => {
        value = (value.trim()).toLowerCase()
        let user = await User.findOne({ deleted: false, email: value, type: req.body.type })
        if (user) throw new Error(i18n.__("user already exists"))
      }),
      body('password').not().isEmpty().withMessage(() => { return i18n.__('password is Required') }),
      body('confirmPassword').not().isEmpty().withMessage(() => { return i18n.__('password is Required') }),
      body('phone').not().isEmpty().withMessage(() => { return i18n.__("phone number is required") }),
      body('type').not().isEmpty().withMessage(() => { return i18n.__("type is required") }).isIn(['GUEST']).withMessage(() => { return i18n.__("wrong user type") }),
    ];
    return validation;
  }
}