import { RequestHandler } from "express";
import { AuthenticatedRequest } from "../../types/Requests";
import mongoose from "mongoose";

const AuthenticationMiddleware: RequestHandler = function (
	req: AuthenticatedRequest,
	res,
	next
) {
	try {
		req.user = {
			id: new mongoose.Types.ObjectId(),
		};
	} catch {
		return res.status(500).send();
	}

	next();
};

export default AuthenticationMiddleware;
