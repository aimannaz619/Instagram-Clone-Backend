const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

// Generate a version 1 UUID (time-based)
const uuid = uuidv4();

 // Output: '6c84fb90-12c4-11e1-840d-7b25c5ee775a' (example)


const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
};

const fileUpload = multer({
//   limits: 500000 , 
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname); // A unique filename to prevent overwriting
    },
  }),
  fileFilter: (req, file, cb) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    let error = isValid ? null : new Error('Invalid mime type!');
    cb(error, isValid);
  }
});

module.exports = fileUpload;
