import Farmacia from "../../types/Farmacia";
import FarmaciaRepository from "../repositories/Farmacia.repository";

async function createFarmaciaService(data: Farmacia) {
	const { erro, farmacia } = await FarmaciaRepository.createFarmacia(data);

	if (erro) {
		throw erro;
	}

	return farmacia;
}

export default createFarmaciaService;
