import FarmaciaRepository from "../repositories/Farmacia.repository";
import { extrairPaginacao } from "../utils/paginacao";

interface FiltrosFarmacia {}

async function listFarmaciasService(params: any) {
	const filtros = {};
	const { limite, pagina } = extrairPaginacao(params);

	const paginacao = {
		limite: limite || 10,
		pagina: pagina || 1
	}

	const farmacias = await FarmaciaRepository.findFarmacias(filtros, paginacao)

	return farmacias
}

export default listFarmaciasService;
