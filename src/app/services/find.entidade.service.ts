import EntidadeRepository from "../repositories/Entidade.repository";

async function findEntidadeService(id: string) {
	const { entidade, erro } = await EntidadeRepository.findEntidadeId(id);

	if (erro) {
		throw erro;
	}

	return entidade;
}

export default findEntidadeService;
