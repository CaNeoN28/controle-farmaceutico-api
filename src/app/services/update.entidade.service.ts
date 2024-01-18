import EntidadeRepository from "../repositories/Entidade.repository";

async function updateEntidadeService(id: string, data: any) {
	const { entidade, erro } = await EntidadeRepository.updateEntidade(id, data);

	if (erro) {
		throw erro;
	}

	return entidade;
}

export default updateEntidadeService;
