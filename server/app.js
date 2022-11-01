import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import postRoutes from "./routes/posts.js";
import userRouter from "./routes/user.js";
import dotenv from "dotenv";

const app = express();
dotenv.config();

const domainsFromEnv = process.env.CORS_DOMAINS ?? "";
const whitelisted = domainsFromEnv.split(",").map((item) => item.trim());

const corsOptions = {
	origin: (origin, callback) => {
		if (!origin || whitelisted.indexOf(origin) !== -1) callback(null, true);
		else callback(new Error("Not allowed by CORS"));
	},
	credentials: true,
};

app.use(express.json({ limit: "50mb", extended: true }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors(corsOptions));

app.use("/posts", postRoutes);
app.use("/user", userRouter);

mongoose
	.connect(process.env.MONGO_CONNECTION_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() =>
		app.listen(process.env.NODE_PORT, () =>
			console.log(
				`Server Running on Port: http://localhost:${process.env.NODE_PORT}`
			)
		)
	)
	.catch((error) => console.log(`${error} did not connect`));

mongoose.set("useFindAndModify", false);
