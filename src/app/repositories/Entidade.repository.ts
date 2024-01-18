import mongoose from "mongoose";
import Entidade, { FiltrosEntidade } from "../../types/Entidade";
import Erro from "../../types/Erro";
import EntidadeModel from "../models/Entidade";
import { erroParaDicionario } from "../utils/mongooseErrors";
import { Paginacao } from "../../types/Paginacao";
import { calcularPaginas } from "../utils/paginacao";

class EntidadeRepository {
	static async findEntidade(filtros: FiltrosEntidade) {
		const entidade = await EntidadeModel.findOne(filtros);

		return entidade;
	}
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
	static async findEntidades(filtros: FiltrosEntidade, paginacao: Paginacao) {
		const { limite, pagina } = paginacao;

		const documentos_totais = await EntidadeModel.countDocuments(filtros);
		const pular = limite * (pagina - 1);
		const paginas_totais = calcularPaginas(documentos_totais, limite);

		const entidades = await EntidadeModel.find(filtros)
			.limit(limite)
			.skip(pular);

		return {
			dados: entidades,
			documentos_totais,
			limite,
			pagina,
			paginas_totais,
		};
	}
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
