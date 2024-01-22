import Erro from "../../types/Erro";
import Farmacia from "../../types/Farmacia";
import FarmaciaModel from "../models/Farmacia";
import { erroParaDicionario } from "../utils/mongooseErrors";

class FarmaciaRepository {
	static async findFarmaciaId(id: string) {
		const farmacia = await FarmaciaModel.findById(id);
		let erro: Erro | undefined = undefined;

		if (!farmacia) {
			erro = {
				codigo: 404,
				erro: "Farmácia não encontrada",
			};
		}

		return {
			farmacia,
			erro,
		};
	}
	static findFarmacia(params: any) {}
	static findFarmacias(params: any) {}
	static async createFarmacia(data: Farmacia) {
		const farmacia = new FarmaciaModel(data);
		let erro: Erro | undefined = undefined;

		const errosValidacao = farmacia.validateSync();

		if (errosValidacao) {
			const { codigo, erros } = erroParaDicionario("Farmácia", errosValidacao);

			erro = {
				codigo,
				erro: erros,
			};
		}

		return {
			farmacia,
			erro,
		};
	}
	static updateFarmacia(id: string, params: any) {}
	static deleteFarmacia(id: string) {}
}

export default FarmaciaRepository;
