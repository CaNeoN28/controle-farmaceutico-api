import FarmaciaRepository from "../repositories/Farmacia.repository";

interface Parametros {
	municipio?: string;
	estado?: string;
	tempo?: string;
}

async function listPorEscalaFarmaciaService(params: Parametros) {
	let { estado, municipio, tempo } = params;
	const filtros: any = {};

	if (!tempo) {
		tempo = new Date().toString();
	}

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

	const { dados } = await FarmaciaRepository.findFarmacias(filtros, paginacao);
	const dateTime = new Date(tempo);

	if (isNaN(Number(dateTime))) {
		throw {
			codigo: 400,
			erro: "Tempo informado inválido",
		};
	}

	const farmacias = dados.map(d => {
		return d
	})

	return farmacias;
}

export default listPorEscalaFarmaciaService;
