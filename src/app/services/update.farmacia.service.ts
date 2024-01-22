import Erro from "../../types/Erro";
import FarmaciaRepository from "../repositories/Farmacia.repository";
import validarDiasServico from "../utils/validarHorarioServico";
import { validarID } from "../utils/validators";

async function updateFarmaciaService(id: string, data: any) {
	if (validarID<string>(id)) {
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

		const { erros, farmacia } = await FarmaciaRepository.updateFarmacia(
			id,
			data
		);

		if(erros) {
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
	} else {
		throw {
			codigo: 400,
			erro: "Id inválido",
		};
	}
}

export default updateFarmaciaService;
