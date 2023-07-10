// /**
//  * BookController
//  *
//  * @description :: Server-side actions for handling incoming requests.
//  * @help        :: See https://sailsjs.com/docs/concepts/actions
//  */

const path = require("path");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

cloudinary.config({ 
  cloud_name: 'dbduq5yyz', 
  api_key: '622879777149479', 
  api_secret: 'nz-v05L-bvmGZDeGvekgQJANP3s' 
});

// const storage = multer.diskStorage({});
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads"); // Specify the desired destination folder for uploaded files
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + extension);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 10, // 10MB limit
  },
}).fields([
  { name: "coverImage", maxCount: 1 },
  { name: "bookPdf", maxCount: 1 },
]);

module.exports = {
  uploadBook: (req, res) => {
    upload(req, res, (err) => {
      if (err) {
        return res.serverError(err);
      }

      // const coverImage = req.files["coverImage"][0];
      const bookPdf = req.files["bookPdf"][0];

      const { title, author } = req.body;

      // cloudinary.uploader.upload(coverImage.path, (error, result) => {
      //   if (error) {
      //     return res.serverError(error);
      //   }

      //   const coverImageURL = result.secure_url;

        cloudinary.uploader.upload(bookPdf.path, (err, result) => {
          if (err) {
            return res.serverError(err);
          }

          const bookPdfURL = result.secure_url;

          Book.create({
            title,
            author,
            // coverImage: coverImageURL,
            bookPdf: bookPdfURL,
          }).exec((dbErr, book) => {
            if (dbErr) {
              return res.serverError(dbErr);
            }

            return res.json(book);
          });
        }
        );
      // }
       } )
    }
    // );
  }
// };

// const cloudinaryService = require("../services/CloudinaryService");
// const multer = require('multer');

// const uploadImage = async (req, res) => {
//   const file = req.file("coverImage")._files[0];
//   console.log(file);
//   const imageUrl = await cloudinaryService.uploadImage(file);
//   return imageUrl;
// };

// const uploadPdf = async (req, res) => {
//   const file = req.file("bookPdf")._files[0];
//   const pdfUrl = await cloudinaryService.uploadPdf(file);
//   return pdfUrl;
// };

// module.exports = {
//   uploadBook: async (req, res) => {
//     const { title, author } = req.body;
//     console.log(req.body);
//     const book = await Book.create({
//       title: title,
//       author: author,
//       coverImage: uploadImage(),
//       bookPdf: uploadPdf(),
//     });

//     return res.send("ok");
//   },
// };
