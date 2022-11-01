import { validationResult } from "express-validator";

export const ErrorHandler = async (handler, req, res, next) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const missingFields =
				errors?.errors?.map(({ param = null }) => param && param) ?? [];
			const error = new Error();
			error.statusCode = 400;
			error.message = `The following fields are either invalid or missing: ${missingFields}`;
			throw error;
		}
		await handler(req, res, next);
	} catch (error) {
		next(error);
	}
};
