import Entidade from "../../types/Entidade";
import EntidadeRepository from "../repositories/Entidade.repository";

async function createEntidadeService(data: Entidade) {
	const { entidade, erro } = await EntidadeRepository.createEntidade(data);

	if (erro) {
		throw erro;
	}

	return entidade;
}

export default createEntidadeService;
