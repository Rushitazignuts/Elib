/**
 * Book.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    title: {
      type: "string",
      required: true,
    },
    author: {
      type: "string",
      required: true,
    },
    coverImage: {
      type: "string",
      required: true,
    },
    bookPdf: {
      type: "string",
      required: true,
    },
  },
};
//Krupali@1