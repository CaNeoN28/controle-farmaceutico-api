import path from "path";
import { v4 as uuidv4 } from "uuid";
import ImagemRepository from "../repositories/Imagem.repository";
import { UploadedFile } from "express-fileupload";

export default async function criarImagemService(
	finalidade: string,
	arquivos: UploadedFile[]
) {
	const relacao_arquivos: {
		[key: string]: string;
	} = {};

	arquivos.map((a) => {
		const nome_arquivo = a.name;
		const uuid = uuidv4();
		const extensao = path.extname(nome_arquivo);
		const nome_completo = uuid + extensao;

		relacao_arquivos[nome_arquivo] = nome_completo;
	});

	Object.keys(relacao_arquivos).map(async (k) => {
		const nome_arquivo = relacao_arquivos[k]

		await ImagemRepository.criarImagem(finalidade, nome_arquivo)
	})

	return relacao_arquivos;
}
