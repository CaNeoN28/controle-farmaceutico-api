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
	const imagem = await ImagemRepository.confirmarImagem(
		finalidade,
		id_finalidade,
		caminho
	);

	if (!imagem) {
		throw {
			codigo: 404,
			erro: "Imagem não encontrada",
		} as Erro;
	}

	const caminhoImagem = path.join(
		`files/imagens/${finalidade}`,
		imagem.caminho_imagem
	);

	arquivo.mv(caminhoImagem, (err) => {
		throw { codigo: 500, erro: "Não foi possível salvar imagem" } as Erro;
	});
}
