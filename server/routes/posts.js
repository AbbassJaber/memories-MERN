import express from "express";
import {
	getPosts,
	getPostsBySearch,
	getPostsByCreator,
	getPost,
	createPost,
	updatePost,
	likePost,
	commentPost,
	deletePost,
} from "../controllers/postsController.js";
import { ErrorHandler } from "../utils/highOrderHelper.js";
import { auth } from "../middlewares/auth";

const router = express.Router();

router.get("/creator", (req, res, next) =>
	ErrorHandler(getPostsByCreator, req, res, next)
);
router.get("/search", (req, res, next) =>
	ErrorHandler(getPostsBySearch, req, res, next)
);
router.get("/", (req, res, next) => ErrorHandler(getPosts, req, res, next));
router.get("/:id", (req, res, next) => ErrorHandler(getPost, req, res, next));

router.post("/", auth, (req, res, next) =>
	ErrorHandler(createPost, req, res, next)
);
router.patch("/:id", auth, (req, res, next) =>
	ErrorHandler(updatePost, req, res, next)
);
router.delete("/:id", auth, (req, res, next) =>
	ErrorHandler(deletePost, req, res, next)
);
router.patch("/:id/likePost", auth, (req, res, next) =>
	ErrorHandler(likePost, req, res, next)
);
router.post("/:id/commentPost", (req, res, next) =>
	ErrorHandler(commentPost, req, res, next)
);

export default router;
