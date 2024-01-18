import EntidadeRepository from "../repositories/Entidade.repository";

async function deleteEntidadeService(id: string) {
	const { entidade, erro } = await EntidadeRepository.deleteEntidade(id);

	if(erro){
		throw erro
	}

	return entidade
}

export default deleteEntidadeService;
