import FarmaciaRepository from "../repositories/Farmacia.repository";
import { extrairPaginacao } from "../utils/paginacao";

interface FiltrosFarmacia {
	nome_fantasia: string;
	municipio: string;
	bairro: string;
	estado: string;
}

async function listFarmaciasService(params: any) {
	const { bairro, estado, municipio, nome_fantasia }: FiltrosFarmacia = params;
	const filtros: any = {};

	if (bairro) {
		filtros.bairro = new RegExp(bairro, "i");
	}
	if (estado) {
		filtros.estado = new RegExp(estado, "i");
	}
	if (municipio) {
		filtros.municipio = new RegExp(municipio, "i");
	}
	if (nome_fantasia) {
		filtros.nome_fantasia = new RegExp(nome_fantasia, "i");
	}

	const { limite, pagina } = extrairPaginacao(params);

	const paginacao = {
		limite: limite || 10,
		pagina: pagina || 1,
	};

	const farmacias = await FarmaciaRepository.findFarmacias(filtros, paginacao);

	return farmacias;
}

export default listFarmaciasService;
