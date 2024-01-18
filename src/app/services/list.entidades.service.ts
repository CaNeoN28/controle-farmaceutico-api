import { FiltrosEntidade } from "../../types/Entidade";
import EntidadeRepository from "../repositories/Entidade.repository";

async function listEntidadesService(params: FiltrosEntidade) {
	const { estado, municipio, nome_entidade } = params;
	const filtros: FiltrosEntidade = {};

	if (estado) {
		filtros.estado = estado;
	}
	if (municipio) {
		filtros.municipio = municipio;
	}
	if (nome_entidade) {
		filtros.nome_entidade = new RegExp(nome_entidade);
	}

	const entidades = await EntidadeRepository.findEntidades(filtros)

	return entidades

}

export default listEntidadesService;
