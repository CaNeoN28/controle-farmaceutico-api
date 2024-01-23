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
			const arquivo = req.files;

			if (arquivo) {
				const imagem = arquivo.imagem;
			} else {
				throw {
					codigo: 400,
					erro: "É necessário o envio de um arquivo",
				};
			}

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
