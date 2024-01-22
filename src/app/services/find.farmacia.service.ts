import { validarID } from "../utils/validators";

async function findFarmaciaService(id: string) {
	if (validarID<string>(id)) {
	} else {
		throw {
			codigo: 400,
			erro: "Id inválido",
		};
	}
}

export default findFarmaciaService;
