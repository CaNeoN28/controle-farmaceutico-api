import { RequestHandler } from "express";
import { UploadedFile } from "express-fileupload";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fileSystem from "fs";

class ImagensControllers {
	static EnviarImagem: RequestHandler = async function (req: any, res, next) {
		try {
			const arquivos = req.arquivos as UploadedFile[];
			const relacao_arquivos: {
				[key: string]: string;
			} = {};

			arquivos.map((a: UploadedFile) => {
				const uuid = uuidv4();
				const extensao = path.extname(a.name);
				const nome_completo = uuid + extensao;
				const caminho = path.join("files/images", nome_completo);

				relacao_arquivos[a.name] = nome_completo;

				a.mv(caminho, (err) => {
					res.status(500).send(err);
				});
			});

			res.status(201).send(relacao_arquivos);
		} catch (error) {
			next(error);
		}
	};

	static RemoverImagem: RequestHandler = async function (req, res, next) {
		try {
			const { id } = req.params;
			fileSystem.unlink(`files/images/${id}`, (err) => {
				if (err) {
					console.log(err);
					return res.status(500).send("Não foi possível remover a imagem");
				} else {
					return res.status(204).send();
				}
			});
		} catch (error) {
			console.log(error);
		}
	};
}
export default ImagensControllers;
