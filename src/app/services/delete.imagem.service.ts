import Erro from "../../types/Erro";
import ImagemRepository from "../repositories/Imagem.repository";
import fileSystem from "fs";

async function deleteImagemService(
	finalidade: string,
	id_finalidade: string,
	caminho: string
) {
	await ImagemRepository.removerImagem(finalidade, id_finalidade, caminho);

	let erro: any = undefined;

	fileSystem.unlink(`files/imagens/${caminho}`, (err) => {
		if (err) {
			if (err.code === "ENOENT")
				erro = {
					codigo: 404,
					erro: "Imagem não encontrada",
				};
			else {
				erro = {
					codigo: 500,
					erro: "Não foi possível remover a imagem",
				};
			}
		}
	});

	if (erro) {
		throw erro;
	}
}

export default deleteImagemService;
