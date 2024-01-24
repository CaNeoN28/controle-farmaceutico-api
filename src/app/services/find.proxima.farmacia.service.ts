import FarmaciaRepository from "../repositories/Farmacia.repository";

interface Filtros {
	municipio?: string;
	estado?: string;
	latitude?: string;
	longitude?: string;
}

async function findNearestFarmaciaService(params: Filtros) {
	const { municipio, estado, latitude, longitude } = params;
	const filtros: any = {};

	if (municipio || estado) {
		filtros.endereco = {};

		if (municipio) {
			filtros.endereco.municipio = municipio;
		}

		if (estado) {
			filtros.endereco.estado = estado;
		}
	}

	const paginacao = {
		pagina: 1,
		limite: 100,
	};

	const { dados } = await FarmaciaRepository.findFarmacias(filtros, paginacao);

	return dados;
}

export default findNearestFarmaciaService;
