import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const signin = async ({ body: { email, password } }, res) => {
	const oldUser = await User.findOne({ email });
	if (!oldUser) return res.status(404).json({ message: "User doesn't exist" });
	const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);
	if (!isPasswordCorrect)
		return res.status(400).json({ message: "Invalid credentials" });
	const token = jwt.sign(
		{ email: oldUser.email, id: oldUser._id },
		process.env.SECRET,
		{
			expiresIn: "1h",
		}
	);
	res.status(200).json({ result: oldUser, token });
};

export const signup = async (
	{ body: { email, password, firstName, lastName } },
	res
) => {
	const oldUser = await User.findOne({ email });
	if (oldUser) return res.status(400).json({ message: "User already exists" });
	const hashedPassword = await bcrypt.hash(password, 12);
	const result = await User.create({
		email,
		password: hashedPassword,
		name: `${firstName} ${lastName}`,
	});
	const token = jwt.sign(
		{ email: result.email, id: result._id },
		process.env.SECRET,
		{
			expiresIn: "1h",
		}
	);
	res.status(201).json({ result, token });
};
