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
		filtros["endereco.estado"] = estado;
	}

	if (municipio) {
		filtros["endereco.municipio"] = municipio;
	}

	const paginacao = {
		pagina: 1,
		limite: 1000,
	};

	const { dados } = await FarmaciaRepository.findFarmacias(filtros, paginacao);
	let dateTime = new Date(tempo);

	if (isNaN(Number(dateTime))) {
		throw {
			codigo: 400,
			erro: "Tempo informado inválido",
		};
	}

	const { dia, mes, ano } = {
		dia: dateTime.getDate(),
		mes: dateTime.getMonth() + 1,
		ano: dateTime.getFullYear(),
	};

	dateTime = new Date([ano, mes, dia].join("/"));

	let escala: {
		[key: string]: any[];
	} = {};

	dados.map((d) => {
		const dias = d.plantoes.filter((p) => {
			const dataPlantao = new Date(p);

			const valido = dataPlantao.getTime() >= dateTime.getTime();

			return valido;
		});

		dias.map((dia) => {
			if (escala[dia]) {
				escala[dia].push(d);
			} else {
				escala[dia] = [d];
			}
		});
	});

	const array = Object.entries(escala).sort((a, b) => {
		return a[0] > b[0] ? 1 : -1;
	});

	escala = Object.fromEntries(array);

	return escala;
}

export default listPorEscalaFarmaciaService;
