import FarmaciaRepository from "../repositories/Farmacia.repository";
import farmaciasAbertas from "../utils/farmaciasAbertas";
import pontoMaisProximo from "../utils/pontoMaisProximo";

interface Filtros {
	municipio?: string;
	estado?: string;
	latitude?: string | number;
	longitude?: string | number;
	tempo?: string;
}

async function findNearestFarmaciaService(params: Filtros) {
	let { municipio, estado, latitude, longitude, tempo } = params;
	const filtros: any = {};

	if (!tempo) {
		tempo = new Date().toString()
	}

	const datetime = new Date(tempo);

	if (isNaN(Number(datetime))) {
		throw {
			codigo: 400,
			erro: "Tempo inválido",
		};
	}

	if (!latitude || !longitude) {
		throw {
			codigo: 400,
			erro: "Latitude e longitude são obrigatórios",
		};
	}

	latitude = Number(latitude)
	longitude = Number(longitude)

	if(isNaN(latitude) || isNaN(longitude)){
		const errosValidacao: any = {}

		if(isNaN(latitude))
			errosValidacao.latitude = "Latitude inválida"

		if(isNaN(longitude))
			errosValidacao.longitude = "Longitude inválida"

		throw {
			codigo: 400,
			erro: errosValidacao
		}
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
		limite: 1000,
	};

	const { dados } = await FarmaciaRepository.findFarmacias(filtros, paginacao);

	const farmacias = farmaciasAbertas(dados as any, tempo)

	const referenciais = farmacias.map((f) => {
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
