import FarmaciaRepository from "../repositories/Farmacia.repository";
import { validarID } from "../utils/validators";

async function findFarmaciaService(id: string) {
	if (validarID<string>(id)) {
		const { farmacia, erro } = await FarmaciaRepository.findFarmaciaId(id);

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

export default findFarmaciaService;
