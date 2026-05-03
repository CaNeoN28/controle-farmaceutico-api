import Erro from "../../types/Erro";
import Farmacia, { IPlantao } from "../../types/Farmacia";
import FarmaciaRepository from "../repositories/Farmacia.repository";
import validarDiasServico from "../utils/validarHorarioServico";
import { validarPlantoes } from "../utils/validarPlantoes";

async function createFarmaciaService(data: Farmacia) {
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

	const { erro: erros, farmacia } =
		await FarmaciaRepository.createFarmacia(data);

	if (erros || errosDiasServico || errosPlantoes.length > 0) {
		erro = {
			codigo: erros?.erro.codigo || 400,
			erro: {},
		};

		if (erros) erro.erro = { ...erros.erro };
		if (errosDiasServico) erro.erro = { ...erro.erro, ...errosDiasServico };
		if (errosPlantoes.length > 0) erro.erro.plantoes = errosPlantoes;
	}

	if (erro) {
		throw erro;
	}

	return farmacia;
}

export default createFarmaciaService;
