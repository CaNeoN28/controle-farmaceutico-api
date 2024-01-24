import FarmaciaRepository from "../repositories/Farmacia.repository";

interface Parametros {
	municipio?: string;
	estado?: string;
	tempo?: string;
}

async function listPorEscalaFarmaciaService(params: Parametros) {
	const { estado, municipio, tempo } = params;
	const filtros: any = {};

	if (estado) {
		filtros.estado = estado;
	}

	if (municipio) {
		filtros.municipio = municipio;
	}

	const paginacao = {
		pagina: 1,
		limite: 1000,
	};

	const {dados: farmacias} = await FarmaciaRepository.findFarmacias(filtros, paginacao);

	return farmacias;
}

export default listPorEscalaFarmaciaService;
