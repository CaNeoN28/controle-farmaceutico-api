import mongoose from "mongoose";
import Entidade from "../../types/Entidade";
import Erro from "../../types/Erro";
import EntidadeModel from "../models/Entidade";
import { erroParaDicionario } from "../utils/mongooseErrors";

class EntidadeRepository {
	static async findEntidadeId(id: string) {
		let erro: Erro | undefined = undefined;

		const idValido = mongoose.isValidObjectId(id);

		if (!idValido) {
			erro = {
				codigo: 400,
				erro: "Id inválido",
			};
		} else {
			const entidade = await EntidadeModel.findById(id);

			if (entidade) {
				return {
					entidade,
					erro: undefined,
				};
			} else {
				erro = {
					codigo: 404,
					erro: "Entidade não encontrada",
				};
			}
		}

		return {
			entidade: undefined,
			erro,
		};
	}
	static findEntidades(params: any) {}
	static async createEntidade(data: Entidade) {
		let erro: Erro | undefined = undefined;
		const entidade = new EntidadeModel(data);

		let errosValidacao = entidade.validateSync();

		if (errosValidacao) {
			const { erros, codigo } = erroParaDicionario("Entidade", errosValidacao);

			erro = {
				codigo,
				erro: erros,
			};
		} else {
			await entidade.save();
		}

		return { entidade, erro };
	}
	static updateEntidade(id: string, data: any) {}
	static deleteEntidade(id: string) {}
}

export default EntidadeRepository;
