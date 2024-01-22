import { validarID } from "../utils/validators";

function updateFarmaciaService(id: string, data: any) {
	if (validarID<string>(id)) {
	} else {
		throw {
			codigo: 400,
			erro: "Id inválido",
		};
	}
}

export default updateFarmaciaService;
