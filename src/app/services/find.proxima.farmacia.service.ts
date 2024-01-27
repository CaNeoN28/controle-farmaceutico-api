import Erro from "../../types/Erro";
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
	let erros: Erro | undefined = undefined;

	if (!tempo) {
		tempo = new Date().toString();
	}

	const datetime = new Date(tempo);

	if (isNaN(Number(datetime))) {
		erros = {
			codigo: 400,
			erro: {
				tempo: "Tempo inválido"
			}
		}
	}

	if(!latitude){
		erros = {
			codigo: 400,
			erro: {
				...erros?.erro,
				latitude: "Latitude é obrigatória"
			}
		}
	}

	if(!longitude){
		erros = {
			codigo: 400,
			erro: {
				...erros?.erro,
				longitude: "Longitude é obrigatória"
			}
		}
	}

	latitude = Number(latitude);
	longitude = Number(longitude);

	if(isNaN(latitude)){
		erros = {
			codigo: 400,
			erro: {
				...erros?.erro,
				latitude: "Latitude inválida"
			}
		}
	}

	if(isNaN(longitude)){
		erros = {
			codigo: 400,
			erro: {
				...erros?.erro,
				longitude: "Longitude inválida"
			}
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

	if(erros){
		throw erros
	}

	const { dados } = await FarmaciaRepository.findFarmacias(filtros, paginacao);

	const farmacias = farmaciasAbertas(dados as any, tempo);

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

	const maisProximo = pontoMaisProximo(localizacao, referenciais);

	if (maisProximo) {
		const { identificador } = maisProximo;
		const farmacia = dados.find((d) => d.id === identificador);

		return farmacia;
	}

	throw {
		codigo: 404,
		erro: "Não há farmácias abertas próximas",
	};
}

export default findNearestFarmaciaService;
