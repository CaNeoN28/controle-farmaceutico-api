import { RequestHandler } from "express";

function VerificarArquivosMiddleware(chave: string) {
	return async function (req: any, res, next) {
		const { files } = req;

		if (!files) {
			return res
				.status(400)
				.send("É necessário o envio de pelo menos um arquivo");
		}

		const arquivosEspecificos = files[chave];

		if (!arquivosEspecificos) {
			return res.status(400).send(`Nenhum arquivo encontrado para "${chave}"`);
		}

		req.arquivos = arquivosEspecificos;

		next();
	} as RequestHandler;
}

export default VerificarArquivosMiddleware;
