import { RequestHandler } from "express";

class ImagensControllers {
	static EncontrarImagemPorId: RequestHandler = async function (req, res, next) {
		res.send("Encontrar imagem por ID");
	};

	static EnviarImagem: RequestHandler = async function (req, res, next) {
		res.send("Enviar imagem");
	};

	static RemoverImagem: RequestHandler = async function (req, res, next) {
		res.send("Remover imagem");
	};
}
export default ImagensControllers;
