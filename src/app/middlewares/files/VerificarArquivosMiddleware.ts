import { RequestHandler } from "express";

const VerificarArquivosMiddleware: RequestHandler = async function (
	req,
	res,
	next
) {
	const { files } = req;

	if (!files) {
		return res
			.status(400)
			.send("É necessário o envio de pelo menos um arquivo");
	}

	next();
};

export default VerificarArquivosMiddleware;
