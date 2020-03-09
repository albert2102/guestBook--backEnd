var express = require ("express");
var userRoute = require ("./component/user.component/user.route");

const router = express();


router.use('/users', userRoute)


module.exports = router;
