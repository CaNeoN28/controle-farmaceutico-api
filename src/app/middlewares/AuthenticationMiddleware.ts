import { RequestHandler } from "express";

const AuthenticationMiddleware: RequestHandler = function (req, res, next) {
	try {
		const header = {};
		next(header);
	} catch {
		res.status(500).send();
	}
};

export default AuthenticationMiddleware;
