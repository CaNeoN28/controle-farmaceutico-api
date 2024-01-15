import { ErrorRequestHandler } from "express";

const ErrorMiddleware: ErrorRequestHandler = async function (err, req, res, next) {
	try {

	} catch (err) {
		res.status(500).send("Erro interno do servidor")
	}
}

export default ErrorMiddleware