// /**
//  * BookController
//  *
//  * @description :: Server-side actions for handling incoming requests.
//  * @help        :: See https://sailsjs.com/docs/concepts/actions
//  */

// const multer = require("multer");
// const upload = multer({
//   dest: "uploads/",
//   limits: {
//     fileSize: 10 * 1024 * 1024, // Limit file size to 10 MB
//   },
//   fileFilter: function (req, file, cb) {
//     if (file.mimetype === "application/pdf") {
//       cb(null, true);
//     } else {
//       cb(new Error("Only PDF files are allowed!"));
//     }
//   },
// });

// module.exports = {
//   uploadBook: (req, res) => {
//     upload.single("pdf")(req, res, function (err) {
//       if (err) {
//         return res
//           .status(500)
//           .json({ success: false, msg: "Something Went Wrong", error: err });
//       }
//       const pdfFile = req.file;
//       if (!pdfFile) {
//         return res.status(400).json({ success: false, msg: "No PDF uploaded" });
//       }
//       const bookData = {
//         title: req.body.title,
//         author: req.body.author,
//         pdf: pdfFile.filename,
//       };

//       const book = Book.create(bookData);
//       if (!book) {
//         return res
//           .status(500)
//           .json({ success: false, msg: "Something Went Wrong" });
//       }
//       return res.status(201).json({ success: true, msg: "Book Created!" });
//     });
//   },
// };

// const path = require('path')

// module.exports = {
//   upload: async (req, res) => {
//     try {
//       req.file("pdf").upload(async (err, files) => {
//         if (err) {
//           return res
//             .status(500)
//             .json({ success: false, msg: "Something Went Wrong", error: err });
//         }
//         if (files.length === 0) {
//           return res
//             .status(400)
//             .json({ success: false, msg: "No file upladed" });
//         }
//         const pathName = path.basename(files[0].fd);
//         const { title, author } = req.body;

//         const newBook = await Book.create({
//           title: title,
//           author: author,
//           pdf: pathName,
//         });

//         return res.status(201).json({ success: true, msg: "Book Created" });
//       });
//     } catch (error) {
//       return res
//         .status(500)
//         .json({ success: false, msg: "Something Went Wrong", error: error });
//     }
//   },
// };

// const cloudinary = require('cloudinary');
// cloudinary.config({
//     cloud_name: 'dbduq5yyz',
//     api_key: '622879777149479',
//     api_secret: 'nz-v05L-bvmGZDeGvekgQJANP3s'
//   });

// module.exports = {
//     upload : async(req ,res) => {
//         const { coverPage , pdf} = req.allParams();
//         const {author , title} = req.body

//         const uploadedCover = await cloudinary.uploader.upload(coverPage, {
//             folder : 'book-covers'
//         });

//         const uploadedBook = await cloudinary.uploader.upload(pdf, {
//             folder : 'book-pdfs'
//         });

//         const book = await Book.create({title : title, author : author, coverPage : uploadedCover.secure_url, pdf : uploadedBook.secure_url}).fetch();
//         return res.status(201).json({msg : "Created"});
//     }
// }

const path = require("path");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dbduq5yyzE",
  api_key: "622879777149479",
  api_secret: "nz-v05L-bvmGZDeGvekgQJANP3s",
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

      console.log(req.files);
      console.log(req.body)
      const coverImage = req.files["coverImage"][0];
      const bookPdf = req.files["bookPdf"][0];

      const { title, author } = req.body;

      cloudinary.uploader.upload(coverImage.path, (error, result) => {
        if (error) {
          return res.serverError(error);
        }

        const coverImageURL = result.secure_url;

        cloudinary.uploader.upload(bookPdf.path, (err, result) => {
          if (err) {
            return res.serverError(err);
          }

          const bookPdfURL = result.secure_url;

          Book.create({
            title,
            author,
            coverImage: coverImageURL,
            bookPdf: bookPdfURL,
          }).exec((dbErr, book) => {
            if (dbErr) {
              return res.serverError(dbErr);
            }

            return res.json(book);
          });
        });
      });
    });
  },
};
