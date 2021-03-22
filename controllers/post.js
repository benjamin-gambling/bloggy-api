import { body, validationResult } from "express-validator";
// import passport from "passport";
import unescape from "../utils/tools";

import Posts from "../models/post";

const getPosts = (req, res, next) => {
  Posts.find()
    .populate("author")
    .sort("-createdAt")
    .exec((err, posts) => {
      if (err) return res.status(400).json(err);
      res.json(posts);
    });
};

const getPost = (req, res, next) => {
  Posts.findOne({ _id: req.params.postId })
    .populate("author")
    .exec((err, post) => {
      if (err) return res.json(err);
      res.json(post);
    });
};

const publishPost = (req, res, next) => {
  Posts.findOneAndUpdate(
    { _id: req.params.postId },
    { published: true },
    { useFindAndModify: false, new: true }
  )
    .populate("author")
    .exec((err, post) => {
      if (err) return res.status(400).json(err);
      res.json(post);
    });
};

const unpublishPost = (req, res, next) => {
  Posts.findOneAndUpdate(
    { _id: req.params.postId },
    { published: false },
    { useFindAndModify: false, new: true }
  )
    .populate("author")
    .exec((err, post) => {
      if (err) return res.status(400).json(err);
      res.json(post);
    });
};

const createPost = [
  body("title").trim().isLength({ min: 1 }).escape(),
  body("content").trim().isLength({ min: 1 }).escape(),
  unescape("&#x2F;", ""),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res, json(errors.array());

    const { title, content, published } = req.body;

    Posts.findOne({ title, author: req.user._id }).exec((err, prevPost) => {
      !prevPost
        ? Posts.create(
            { title, content, author: req.user._id, published },
            (err, post) => {
              if (err) return res.status(400).json(err);
              post.populate("author", (err, newPost) => {
                if (err) return res.status(400).json(err);
                res.json(newPost);
              });
            }
          )
        : res
            .status(403)
            .json({ message: "Post with same title already exists!" });
    });
  },
];

const editPost = [
  body("title").trim().isLength({ min: 1 }).escape(),
  body("content").trim().isLength({ min: 1 }).escape(),
  unescape("&#x27;", ""),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res, json(errors.array());

    const { title, content } = req.body;
    Posts.findOneAndUpdate(
      { _id: req.params.postId },
      { title, content },
      { useFindAndModify: false, new: true },
      (err, post) => {
        if (err) return res.status(400).json(err);
        post.populate("author", (err, updatedPost) => {
          if (err) return res.status(400).json(err);
          res.json(updatedPost);
        });
      }
    );
  },
];

const deletePost = (req, res, next) => {
  Posts.findOneAndDelete({ _id: req.params.postId }, (err, deletedPost) => {
    if (err) return res.json(err);
    res.json(deletedPost);
  });
};

const postController = {
  getPosts,
  getPost,
  publishPost,
  unpublishPost,
  createPost,
  editPost,
  deletePost,
};

export default postController;
