import Erro from "../../types/Erro";
import ImagemRepository from "../repositories/Imagem.repository";
import fileSystem from "fs";

async function deleteImagemService(
	finalidade: string,
	id_finalidade: string,
	caminho: string
) {
	await ImagemRepository.removerImagem(finalidade, id_finalidade, caminho);

	const erro: any = await new Promise((resolve) => {
		fileSystem.unlink(`files/imagens/${caminho}`, (err) => {
			if (err) {
				if (err.code === "ENOENT")
					resolve({ codigo: 404, erro: "Imagem não encontrada" });
				else
					resolve({ codigo: 500, erro: "Não foi possível remover a imagem" });
			} else {
				resolve(undefined);
			}
		});
	});

	if (erro) {
		throw erro;
	}
}

export default deleteImagemService;
