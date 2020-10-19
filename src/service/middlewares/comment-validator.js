"use strict";

const {HttpCode} = require(`../../constants`);

const commentKeys = [`text`];

module.exports = (req, res, next) => {
  const newComment = req.body;
  const keys = Object.keys(newComment);
  const keyExist = commentKeys.every((key) => keys.includes(key));

  if (!keyExist) {
    res.status(HttpCode.BAD_REQUEST)
      .send(`BAD_REQUEST`);
  }

  return next();
};
