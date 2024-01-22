import FarmaciaRepository from "../repositories/Farmacia.repository";

async function deleteFarmaciaService(id: string) {
	const { farmacia, erro } = await FarmaciaRepository.deleteFarmacia(id);

	if (erro) {
		throw erro;
	}
}

export default deleteFarmaciaService;
