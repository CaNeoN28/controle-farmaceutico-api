import { RequestHandler } from "express";
import { UploadedFile } from "express-fileupload";
import path from "path";

function PermitirExtensoesMiddleware(extensoesPermitidas: string[]) {
	return async function (req: any, res, next) {
		const arquivos = req.arquivos as UploadedFile[];
		const extensoes: string[] = [];

		arquivos.map((a: UploadedFile) => {
			extensoes.push(path.extname(a.name));
		});

		const permitido = extensoes.every((e) => extensoesPermitidas.includes(e));

		if (!permitido) {
			const erros: any = {};

			arquivos.map((a: UploadedFile) => {
				const extensao = path.extname(a.name);

				if (!extensoesPermitidas.includes(extensao)) {
					erros[a.name] = "Extensão inválida de arquivo";
				}
			});

			return res.status(422).send({
				mensagem: `Extensão inválida de arquivos, extensões permitidas: ${extensoesPermitidas.join(
					", "
				)}`,
				erros,
			});
		}

		next()
	} as RequestHandler;
}

export default PermitirExtensoesMiddleware;
