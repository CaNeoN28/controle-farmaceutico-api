import { RequestHandler } from "express";
import { UploadedFile } from "express-fileupload";
import path from "path";

class ImagensControllers {
	static EncontrarImagemPorId: RequestHandler = async function (
		req,
		res,
		next
	) {
		res.send("Encontrar imagem por ID");
	};

	static EnviarImagem: RequestHandler = async function (req: any, res, next) {
		try {
			const arquivos = req.arquivos as UploadedFile[];

			arquivos.map((a: UploadedFile) => {
				const caminho = path.join("files/images", a.name);

				a.mv(caminho, (err) => {
					res.status(500).send(err);
				});
			});

			res.status(201).send("Enviado");
		} catch (error) {
			next(error);
		}
	};

	static RemoverImagem: RequestHandler = async function (req, res, next) {
		res.send("Remover imagem");
	};
}
export default ImagensControllers;
