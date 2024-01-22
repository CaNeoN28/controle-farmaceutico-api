import Erro from "../../types/Erro";
import FarmaciaRepository from "../repositories/Farmacia.repository";
import { validarID } from "../utils/validators";

async function deleteFarmaciaService(id: string) {
	let erros: Erro | undefined = undefined;
	if (validarID<string>(id)) {
		const { farmacia, erro } = await FarmaciaRepository.deleteFarmacia(id);
	} else {
		erros = {
			codigo: 400,
			erro: "Id inválido"
		}
	}

	if (erros) {
		throw erros;
	}
}

export default deleteFarmaciaService;
