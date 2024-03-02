import mongoose, { isValidObjectId, model } from "mongoose";
import ImagemModel from "../models/Imagem";
import Erro from "../../types/Erro";
import FarmaciaRepository from "./Farmacia.repository";
import UsuarioRepository from "./Usuario.repository";

export default class ImagemRepository {
	static async criarImagem(finalidade: string, nome_arquivo: string) {
		const date = new Date();
		const imagem_nao_utilizada = await ImagemModel.findOne({
			confirmacao_expira: { $lt: date, $ne: null },
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
		let erro: Erro | any = undefined;
		let imagem: any = undefined;

		if (!isValidObjectId(id_finalidade)) {
			erro = {
				codigo: 400,
				erro: "id_finalidade é inválido",
			};
		}

		let alvo: any = undefined;

		if (finalidade === "farmacia") {
			const { farmacia } = await FarmaciaRepository.findFarmaciaId(
				id_finalidade
			);

			alvo = farmacia;
		} else if (finalidade === "usuario") {
			const usuario = await UsuarioRepository.findUsuarioId(id_finalidade);

			alvo = usuario;
		}

		if (!alvo || (alvo.imagem_url && alvo.imagem_url !== caminho)) {
			erro = {
				codigo: 400,
				erro: "Não foi possível salvar imagem",
			};
		} else {
			const imagemExiste = await ImagemModel.findOne({
				finalidade,
				id_finalidade,
				confirmacao_expira: null,
			});

			if (imagemExiste) {
				erro = {
					codigo: 400,
					erro: "Não foi possível salvar imagem",
				};
			} else {
				imagem = await ImagemModel.findOne({
					finalidade,
					caminho_imagem: caminho,
					confirmacao_expira: { $ne: null },
				});

				if (imagem) {
					await imagem.updateOne({
						id_finalidade,
						confirmacao_expira: null,
					});
				}

				await imagem.save();
			}
		}

		return { imagem, erro };
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
		}
	}
}
