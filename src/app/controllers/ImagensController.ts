import { RequestHandler } from "express";
import { UploadedFile } from "express-fileupload";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fileSystem from "fs";

class ImagensControllers {
	static EncontrarImagemPorId: RequestHandler = async function (
		req,
		res,
		next
	) {
		const { id } = req.params;
		const caminho = path.join("files/images", id);
		const stat = fileSystem.statSync(caminho);
		
		if (stat) {
			res.writeHead(200, {
				"Content-Type": "image/jpeg",
				"Content-Length": stat.size,
			});

			var readStream = fileSystem.createReadStream(caminho);
			// We replaced all the event handlers with a simple call to readStream.pipe()
			readStream.pipe(res);
		} else {
			res.status(404).send("Imagem não encontrada");
		}
	};

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
		res.send("Remover imagem");
	};
}
export default ImagensControllers;
