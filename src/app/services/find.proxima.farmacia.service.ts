import FarmaciaRepository from "../repositories/Farmacia.repository";
import pontoMaisProximo from "../utils/pontoMaisProximo";

interface Filtros {
	municipio?: string;
	estado?: string;
	latitude?: string;
	longitude?: string;
	tempo?: string;
}

async function findNearestFarmaciaService(params: Filtros) {
	const { municipio, estado, latitude, longitude, tempo } = params;
	const filtros: any = {};

	if (!tempo) {
		throw {
			codigo: 400,
			erro: "Tempo é obrigatório",
		};
	}

	if (!latitude || !longitude) {
		throw {
			codigo: 400,
			erro: "Latitude e longitude são obrigatórios",
		};
	}

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

	const referenciais = dados.map((f) => {
		return {
			identificador: f.id,
			localizacao: {
				x: Number(f.endereco.localizacao.x),
				y: Number(f.endereco.localizacao.y),
			},
		};
	});
	const localizacao = {
		x: Number(latitude),
		y: Number(longitude),
	};

	const { identificador } = pontoMaisProximo(localizacao, referenciais);

	const farmacia = dados.find((d) => d.id === identificador);

	return farmacia;
}

export default findNearestFarmaciaService;
