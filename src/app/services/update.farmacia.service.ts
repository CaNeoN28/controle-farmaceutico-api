import Erro from "../../types/Erro";
import { IPlantao } from "../../types/Farmacia";
import FarmaciaRepository from "../repositories/Farmacia.repository";
import validarDiasServico from "../utils/validarHorarioServico";
import validarPlantoes from "../utils/validarPlantoes";
import { validarID } from "../utils/validators";

async function updateFarmaciaService(id: string, data: any) {
	if (validarID<string>(id)) {
		const { horarios_servico, plantoes } = data;

		let erro: Erro | undefined = undefined;
		let errosDiasServico: any = undefined;
		let errosPlantoes: (IPlantao & { mensagem: string })[] = [];

		if (horarios_servico) {
			errosDiasServico = validarDiasServico(horarios_servico);
		}

		if (plantoes) {
			errosPlantoes = validarPlantoes(plantoes);
		}

		const { erros, farmacia } = await FarmaciaRepository.updateFarmacia(
			id,
			data
		);

		if (erros || errosDiasServico || errosPlantoes.length > 0) {
			erro = {
				codigo: erros?.erro.codigo || 400,
				erro: {},
			};

			if (erros) erro.erro = { ...erros.erro };
			if (errosDiasServico) erro.erro.horarios_servico = errosDiasServico;
			if (errosPlantoes.length > 0) erro.erro.plantoes = errosPlantoes;
		}

		if (erro) {
			throw erro;
		}

		return farmacia;
	} else {
		throw {
			codigo: 400,
			erro: "Id inválido",
		};
	}
}

export default updateFarmaciaService;
