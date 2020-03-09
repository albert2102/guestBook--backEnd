var fs = require( "fs");
var ApiError = require( "./Helper/ApiError");
var { validationResult } = require( "express-validator/check");
var { matchedData } = require( "express-validator/filter");
var { toImgUrl } = require ("./utils");

exports.checkValidations = function checkValidations(req) {
  const validationErrors = validationResult(req).array({
    onlyFirstError: true
  });

  if (validationErrors.length > 0) {
    //deleteTempImages(req);

    throw new ApiError(422, validationErrors);
  }

  return matchedData(req);
}
exports.handleImg = async function handleImg(
  req,
  { attributeName = "img", isUpdate = false } = {}
) {
  if (req.file || (isUpdate && req.body[attributeName]))
    // .file contain an 'image'
    return req.body[attributeName] || (await toImgUrl(req, req.file));

  throw new ApiError.UnprocessableEntity(`${attributeName} is required`);
}
exports.removeFile = function removeFile(file = "", files = []) {
  if (files.length > 0) {
    files.forEach(element => {
      fs.unlink(element, err => {
        if (err) throw err;
        console.log("file deleted");
      });
    });
  } else {
    fs.unlink(file, err => {
      if (err) throw err;
      console.log("file deleted");
    });
  }
}
