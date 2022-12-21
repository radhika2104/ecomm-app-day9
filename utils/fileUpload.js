// const multer = require("multer");
// const path = require("path");

// // how to save the file - folder and name
// const storage = multer.diskStorage({
//   // each property accepts functions with parameters
//   destionation: (req, file, cb) => {
//     cb(null, "content");
//     // cb(error, folder to put file into)
//   },
//   fileName: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.orginalName));
//     // cb(error, "file name you want - converting into unqiue file name to handle duplicate names")
//   },
// });

// // uploading the file with right extension using storage. limits,and fextension
// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 1000000 * 100 },
//   //   10mb size in bytes
//   fileFilter: (req, file, cb) => {
//     const fileTypes = /jpg|png|mp4|gif/;
//     // allowed filetYPES
//     const mimeType = fileTypes.test(file.mimetype);
//     const extname = fileTypes.test(path.extname(file.originalname));
//     if (mimeType & extname) {
//       console.log("mimetype and extname: ", mimeType, extname);
//       return cb(null, true);
//     } else {
//       cb("File format is not accepted..");
//     }
//   },
// }).single("content");
// // can upload single file at a time and "content is key inside headers"

// module.exports = upload;

const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Content");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 * 100 },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpg|png|mp4|mkv|flv|mov|wmv|gif/;
    const mimeType = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(path.extname(file.originalname));

    if (mimeType && extname) {
      return cb(null, true);
    }
    cb("Give proper files formate to upload");
  },
}).single("content");

module.exports = upload;
