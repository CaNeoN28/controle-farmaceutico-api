import Erro from "../../types/Erro";
import Farmacia from "../../types/Farmacia";
import FarmaciaRepository from "../repositories/Farmacia.repository";
import validarDiasServico from "../utils/validarHorarioServico";

async function createFarmaciaService(data: Farmacia) {
	const { horarios_servico } = data;
	let erro: Erro | undefined = undefined;

	if (horarios_servico) {
		const errosDiasDeServico = validarDiasServico(horarios_servico);

		if (errosDiasDeServico) {
			erro = {
				codigo: 400,
				erro: errosDiasDeServico,
			};
		}
	}

	const { erro: erros, farmacia } = await FarmaciaRepository.createFarmacia(
		data
	);

	if (erros) {
		if (erro) {
			erro = {
				codigo: erros.codigo,
				erro: {
					...erros.erro,
					...erro.erro,
				},
			};
		} else {
			erro = erros;
		}
	}

	if (erro) {
		throw erro;
	}

	return farmacia;
}

export default createFarmaciaService;
