import express from "express";
import { ErrorHandler } from "../utils/highOrderHelper.js";
import { signin, signup } from "../controllers/usersController.js";

const router = express.Router();

router.post("/signin", (req, res, next) =>
	ErrorHandler(signin, req, res, next)
);
router.post("/signup", (req, res, next) =>
	ErrorHandler(signup, req, res, next)
);

export default router;
