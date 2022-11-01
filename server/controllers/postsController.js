import express from "express";
import mongoose from "mongoose";

import Post from "../models/postModel.js";

const router = express.Router();

export const getPosts = async ({ query: { page } }, res) => {
	const LIMIT = 8;
	const startIndex = (Number(page) - 1) * LIMIT; // get the starting index of every page
	const total = await Post.countDocuments({});
	const posts = await Post.find()
		.sort({ _id: -1 })
		.limit(LIMIT)
		.skip(startIndex);
	res.json({
		data: posts,
		currentPage: Number(page),
		numberOfPages: Math.ceil(total / LIMIT),
	});
};

export const getPostsBySearch = async (
	{ query: { searchQuery, tags } },
	res
) => {
	const title = new RegExp(searchQuery, "i");
	const posts = await Post.find({
		$or: [{ title }, { tags: { $in: tags.split(",") } }],
	});
	res.json({ data: posts });
};

export const getPostsByCreator = async ({ query: { name } }, res) => {
	const posts = await Post.find({ name });
	res.json({ data: posts });
};

export const getPost = async ({ params: { id } }, res) => {
	const post = await Post.findById(id);
	res.status(200).json(post);
};

export const createPost = async ({ body: post, userId }, res) => {
	const newPost = new Post({
		...post,
		creator: userId,
		createdAt: new Date().toISOString(),
	});
	await newPost.save();
	res.status(201).json(newPost);
};

export const updatePost = async (
	{ body: { title, message, creator, selectedFile, tags }, params: { id } },
	res
) => {
	if (!mongoose.Types.ObjectId.isValid(id))
		return res.status(404).send(`No post with id: ${id}`);
	const updatedPost = { creator, title, message, tags, selectedFile, _id: id };
	await Post.findByIdAndUpdate(id, updatedPost, { new: true });
	res.json(updatedPost);
};

export const deletePost = async ({ params: { id } }, res) => {
	if (!mongoose.Types.ObjectId.isValid(id))
		return res.status(404).send(`No post with id: ${id}`);
	await Post.findByIdAndRemove(id);
	res.json({ message: "Post deleted successfully." });
};

export const likePost = async ({ params: { id }, userId }, res) => {
	if (!userId) {
		return res.json({ message: "Unauthenticated" });
	}
	if (!mongoose.Types.ObjectId.isValid(id))
		return res.status(404).send(`No post with id: ${id}`);
	const post = await Post.findById(id);
	const index = post.likes.findIndex((id) => id === String(userId));
	if (index === -1) {
		post.likes.push(userId);
	} else {
		post.likes = post.likes.filter((id) => id !== String(userId));
	}
	const updatedPost = await Post.findByIdAndUpdate(id, post, {
		new: true,
	});
	res.status(200).json(updatedPost);
};

export const commentPost = async ({ params: { id }, body: { value } }, res) => {
	const post = await Post.findById(id);
	post.comments.push(value);
	const updatedPost = await Post.findByIdAndUpdate(id, post, {
		new: true,
	});
	res.json(updatedPost);
};

export default router;
