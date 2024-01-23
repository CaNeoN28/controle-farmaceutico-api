import { RequestHandler } from "express";

class ImagensControllers {
	static EncontrarImagemPorId: RequestHandler = async function (
		req,
		res,
		next
	) {
		res.send("Encontrar imagem por ID");
	};

	static EnviarImagem: RequestHandler = async function (req, res, next) {
		try {
			const arquivo = req.files!;

			console.log(arquivo)

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
