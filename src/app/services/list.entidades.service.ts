import { FiltrosEntidade } from "../../types/Entidade";
import { Paginacao, PaginacaoQuery } from "../../types/Paginacao";
import EntidadeRepository from "../repositories/Entidade.repository";
import { extrairPaginacao } from "../utils/paginacao";

async function listEntidadesService(params: FiltrosEntidade & PaginacaoQuery) {
	const { estado, municipio, nome_entidade }: FiltrosEntidade = params;
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

	const { limite, pagina } = extrairPaginacao(params);

	const paginacao: Paginacao = {
		limite: limite || 10,
		pagina: pagina || 1,
	};

	const resposta = await EntidadeRepository.findEntidades(filtros, paginacao);

	return resposta;
}

export default listEntidadesService;
