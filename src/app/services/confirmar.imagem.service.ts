import { UploadedFile } from "express-fileupload";
import Erro from "../../types/Erro";
import ImagemRepository from "../repositories/Imagem.repository";
import path from "path";

export default async function confirmarImagemService(
	finalidade: string,
	id_finalidade: string,
	caminho: string,
	arquivo: UploadedFile
) {
	const { imagem, erro: erroImagem } = await ImagemRepository.confirmarImagem(
		finalidade,
		id_finalidade,
		caminho
	);

	if (erroImagem) {
		throw erroImagem;
	}

	if (!imagem) {
		throw {
			codigo: 404,
			erro: "Imagem não encontrada",
		} as Erro;
	}

	const caminhoImagem = path.join("files/imagens/", imagem.caminho_imagem);

	const erro: any = await new Promise((resolve) => {
		arquivo.mv(caminhoImagem, (err) => {
			if (err) {
				resolve({ codigo: 500, erro: "Não foi possível salvar imagem" });
			} else {
				resolve(undefined);
			}
		});
	});

	if (erro) throw erro;
}

