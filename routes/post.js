import express from "express";
import passport from "passport";
import postController from "../controllers/post";

const router = express.Router();

// GET all posts
router.get("/", postController.getPosts);

// GET post by ID
router.get("/:postId", postController.getPost);

// POST publish post
router.post("/:postId/publish", [
  passport.authenticate("jwt", { session: false }),
  postController.publishPost,
]);

// POST unpublish post
router.post("/:postId/unpublish", [
  passport.authenticate("jwt", { session: false }),
  postController.unpublishPost,
]);

// POST create post
router.post("/", [
  passport.authenticate("jwt", { session: false }),
  postController.createPost,
]);

// PUT update post
router.put("/:postId", [
  passport.authenticate("jwt", { session: false }),
  postController.editPost,
]);

// DELETE delete post
router.delete("/:postId", [
  passport.authenticate("jwt", { session: false }),
  postController.deletePost,
]);

module.exports = router;
