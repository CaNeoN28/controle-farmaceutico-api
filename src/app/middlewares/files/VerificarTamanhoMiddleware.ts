import { RequestHandler } from "express";
import { UploadedFile } from "express-fileupload";

const MB = 5;
const SIZE_LIMIT = MB * 1024 * 1024;

const VerificarTamanhoMiddleware: RequestHandler = async function (
	req: any,
	res,
	next
) {
	const arquivos = req.arquivos! as UploadedFile[];
	const arquivosAcimaDoLimite: string[] = [];

	arquivos.map((arquivo) => {
		if (arquivo.size > SIZE_LIMIT) {
			arquivosAcimaDoLimite.push(arquivo.name);
		}
	});

	if (arquivosAcimaDoLimite.length > 0) {
		const erros: any = {};

		arquivosAcimaDoLimite.map((a) => {
			erros[a] = `Arquivo acima do limite permitido de ${MB}mb`;
		});

		return res
			.status(400)
			.send({ mensagem: "Arquivos acima do limite de envio", erros });
	}

	next();
};

export default VerificarTamanhoMiddleware;
