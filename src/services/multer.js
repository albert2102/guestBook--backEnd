var multer = require( "multer");
var path = require( "path");
var mkdirp = require( "mkdirp");
var ApiError = require( "../Helper/ApiError");
var mime = require( "mime");
var uuidv4 = require( "uuid/v4");

const fileFilter = (req, file, cb) => {
  // const filetypes = /jpeg|jpg|png|image\/\*/;
  // const mimetype = filetypes.test(file.mimetype);
  // const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  // if (mimetype && extname) {
  //     return cb(null, true);
  // }

  // cb(new ApiError.UnprocessableEntity('File upload only supports images types'));
  return cb(null, true);
};
exports.multersave = function multerSaveTo(folderName) {
  let storage = multer.diskStorage({
    destination: function(req, file, cb) {
      let dest = "uploads/" + folderName;
  
      mkdirp(dest, function(err) {
        if (err) return cb(new ApiError(500, "Couldn't create dest"));
        cb(null, dest);
      });
     
      
    },
    filename: function(req, file, cb) {
      if (!file.originalname.includes(".")) {
        var extension = file.mimetype.split("/")[1];
        file.originalname = file.originalname + "." + extension;
        console.log("new file name ===> " +file.originalname);
      }
   

      cb(null, uuidv4() + path.extname(file.originalname));
    }
    
  });

  return multer({
    storage //,
    //fileFilter,
    /*limits: {
            fileSize: 1024 * 1024 * 10 // limit 10mb
        }*/
  });
}

