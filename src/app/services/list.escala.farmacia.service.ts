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

	const escala: {
		[key: string]: any[];
	} = {};

	dados.map((d) => {
		const dias = d.plantoes.filter((p) => {
			const dataPlantao = new Date(p);

			const valido = dataPlantao.getTime() > dateTime.getTime();

			return valido;
		});

		dias.map(dia => {
			if(escala[dia]){
				escala[dia].push(d)
			} else {
				escala[dia] = [d]
			}
		})
	});

	return escala;
}

export default listPorEscalaFarmaciaService;
