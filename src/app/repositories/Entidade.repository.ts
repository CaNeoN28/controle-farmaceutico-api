import Entidade from "../../types/Entidade";
import Erro from "../../types/Erro";
import EntidadeModel from "../models/Entidade";
import { erroParaDicionario } from "../utils/mongooseErrors";

class EntidadeRepository {
	static findEntidadeId(id: string) {}
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
