var ApiError =require ("../Helper/ApiError");
var { dirname } =require ("path");

exports.toImgUrl = async function toImgUrl(req, multerObject) {
    try {
      // req.protocol+'://'+req.get('host') +
      multerObject.path = "/" + multerObject.path;
  
      return multerObject.path;
    } catch (err) {
      throw new ApiError(500, "can not upload img with error -> " + err.message);
    }
  }