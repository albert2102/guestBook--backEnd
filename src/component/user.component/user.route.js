var express  = require ('express');
var { requireSignIn, requireAuth }  = require ('../../services/passport');
var {multersave}  = require ('../../services/multer');

var userControllers  = require ('../user.component/user.controller');
var userValidation = require('../user.component/user.validation')
let router = express.Router()

router.route("/usersignup").post(multersave('user').single('image'),userValidation.userSignUp(),userControllers.signup)
router.route("/usersignin").post(requireSignIn,userValidation.userSignIn(),userControllers.userSignin)

module.exports = router;
