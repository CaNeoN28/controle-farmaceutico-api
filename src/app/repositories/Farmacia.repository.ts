import Erro from "../../types/Erro";
import Farmacia from "../../types/Farmacia";
import { Paginacao } from "../../types/Paginacao";
import FarmaciaModel from "../models/Farmacia";
import { erroParaDicionario } from "../utils/mongooseErrors";
import { calcularPaginas } from "../utils/paginacao";

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
	static async findFarmacias(filtros: any, paginacao: Paginacao) {
		const { limite, pagina } = paginacao;

		const documentos_totais = await FarmaciaModel.countDocuments(filtros);
		const pular = limite * (pagina - 1);
		const paginas_totais = calcularPaginas(documentos_totais, limite);

		const farmacias = await FarmaciaModel.find(filtros)
			.limit(limite)
			.skip(pular);

		return {
			dados: farmacias,
			documentos_totais,
			limite,
			pagina,
			paginas_totais,
		};
	}
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
		} else {
			await farmacia.save();
		}

		return {
			farmacia,
			erro,
		};
	}
	static async updateFarmacia(id: string, dados: any) {
		let farmacia = await FarmaciaModel.findById(id);
		let erros: Erro | undefined = undefined;

		if (farmacia) {
		} else {
			erros = {
				codigo: 404,
				erro: "Farmácia não encontrada",
			};
		}

		return {
			farmacia,
			erros,
		};
	}
	static deleteFarmacia(id: string) {}
}

export default FarmaciaRepository;
