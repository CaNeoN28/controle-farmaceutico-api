import Erro from "../../types/Erro";
import FarmaciaRepository from "../repositories/Farmacia.repository";
import farmaciasAbertas from "../utils/farmaciasAbertas";
import { extrairPaginacao } from "../utils/paginacao";
import pontoMaisProximo from "../utils/pontoMaisProximo";

interface Filtros {
	municipio?: string;
	estado?: string;
	latitude?: string | number;
	longitude?: string | number;
	tempo?: string;
	pagina?: number;
	limite?: number;
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
				tempo: "Tempo inválido",
			},
		};
	}

	if (!latitude) {
		erros = {
			codigo: 400,
			erro: {
				...erros?.erro,
				latitude: "Latitude é obrigatória",
			},
		};
	}

	if (!longitude) {
		erros = {
			codigo: 400,
			erro: {
				...erros?.erro,
				longitude: "Longitude é obrigatória",
			},
		};
	}

	latitude = Number(latitude);
	longitude = Number(longitude);

	if (isNaN(latitude)) {
		erros = {
			codigo: 400,
			erro: {
				...erros?.erro,
				latitude: "Latitude inválida",
			},
		};
	}

	if (isNaN(longitude)) {
		erros = {
			codigo: 400,
			erro: {
				...erros?.erro,
				longitude: "Longitude inválida",
			},
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
		limite: 1000,
	};

	if (erros) {
		throw erros;
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

	const proximos = pontoMaisProximo(localizacao, referenciais);

	if (proximos) {
		const paginacao = extrairPaginacao(params);
		const { limite, pagina } = {
			limite: paginacao.limite || 1,
			pagina: paginacao.pagina || 10,
		};

		const documentos_totais = proximos?.length;
		const paginas_totais = Math.ceil(documentos_totais / limite);
		const skip = (pagina - 1) * limite;

		const farmacias = proximos.slice(skip, limite + skip).map((p) => {
			return dados.find((d) => d.id === p.identificador);
		});

		return {
			dados: farmacias,
			documentos_totais,
			limite,
			pagina,
			paginas_totais,
		};
	}

	throw {
		codigo: 404,
		erro: "Não há farmácias abertas próximas",
	};
}

export default findNearestFarmaciaService;
