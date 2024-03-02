import { RequestHandler } from "express";
import { UploadedFile } from "express-fileupload";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fileSystem from "fs";
import criarImagemService from "../services/create.imagem.service";
import confirmarImagemService from "../services/confirmar.imagem.service";
import deleteImagemService from "../services/delete.imagem.service";

class ImagensControllers {
	static CriarImagem: RequestHandler = async function (req: any, res, next) {
		try {
			const { finalidade } = req.params as { finalidade?: string };
			const arquivos = req.arquivos as UploadedFile[];

			const relacao_arquivos = await criarImagemService(arquivos, finalidade);

			res.status(201).send(relacao_arquivos);
		} catch (err) {
			next(err);
		}
	};

	static ConfirmarEnvio: RequestHandler = async function (req: any, res, next) {
		const { finalidade, id_finalidade, caminho } = req.params;
		const arquivos = req.arquivos as UploadedFile[];

		try {
			await confirmarImagemService(
				finalidade,
				id_finalidade,
				caminho,
				arquivos[0]
			);

			res.status(201).send();
		} catch (err) {
			next(err);
		}
	};

	static RemoverImagem: RequestHandler = async function (req, res, next) {
		const { finalidade, id_finalidade, caminho } = req.params;

		try {
			await deleteImagemService(finalidade, id_finalidade, caminho);

			res.status(204).send();
		} catch (err) {
			next(err);
		}
	};
}
export default ImagensControllers;
