import Erro from "../../types/Erro";
import ImagemRepository from "../repositories/Imagem.repository";
import fileSystem from "fs";

async function deleteImagemService(
	finalidade: string,
	id_finalidade: string,
	caminho: string
) {
	const imagemExiste = await ImagemRepository.removerImagem(
		finalidade,
		id_finalidade,
		caminho
	);

	if (!imagemExiste) {
		throw {
			codigo: 404,
			erro: "Imagem não encontrada",
		} as Erro;
	}

	try {
		fileSystem.unlink(`files/imagens/${caminho}`, (erro) => {
			try {
				if (erro) {
					if (erro.code === "ENOENT")
						throw {
							codigo: 404,
							erro: "Imagem não encontrada",
						};
					else {
						console.log(erro);
						throw {
							codigo: 500,
							erro: "Não foi possível remover a imagem",
						};
					}
				}
			} catch (err) {
				throw err;
			}
		});
	} catch (err) {
		throw err;
	}
}

export default deleteImagemService;
