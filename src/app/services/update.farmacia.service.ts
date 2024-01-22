import FarmaciaRepository from "../repositories/Farmacia.repository";
import { validarID } from "../utils/validators";

async function updateFarmaciaService(id: string, data: any) {
	if (validarID<string>(id)) {
		const {erros, farmacia} = await FarmaciaRepository.updateFarmacia(id, data)

		if(erros){
			throw erros
		}

		return farmacia
	} else {
		throw {
			codigo: 400,
			erro: "Id inválido",
		};
	}
}

export default updateFarmaciaService;
