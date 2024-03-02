import ImagemModel from "../models/Imagem";

export default class ImagemRepository {
	static async criarImagem(finalidade: string, nome_arquivo: string) {
		const date = new Date();
		const imagem_nao_utilizada = await ImagemModel.findOne({
			confirmacao_expira: { $lt: date },
		});

		const dezMin = 10 * 60 * 1000;

		const novaExpiracao = new Date(Number(date) + dezMin);

		if (imagem_nao_utilizada) {
			await imagem_nao_utilizada.updateOne({
				caminho_imagem: nome_arquivo,
				confirmacao_expira: novaExpiracao,
				finalidade,
			});
		} else {
			const imagem = new ImagemModel({
				caminho_imagem: nome_arquivo,
				confirmacao_expira: novaExpiracao,
				finalidade,
			});

			await imagem.save();
		}
	}
	static async confirmarImagem(
		finalidade: string,
		id_finalidade: string,
		caminho: string
	) {
		const imagem = await ImagemModel.findOne({
			finalidade,
			caminho_imagem: caminho,
		});

		if (imagem) {
			await imagem.updateOne({
				id_finalidade,
				confirmacao_expira: null,
			});

			await imagem.save();
		}

		return imagem;
	}

	static async removerImagem(
		finalidade: string,
		id_finalidade: string,
		caminho: string
	) {
		const imagem = await ImagemModel.findOne({
			finalidade,
			id_finalidade,
			caminho_imagem: caminho,
		});

		if (imagem) {
			await imagem.deleteOne();

			return true;
		}

		return false;
	}
}
