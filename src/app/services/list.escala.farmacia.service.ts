import FarmaciaRepository from "../repositories/Farmacia.repository";
import { extrairPaginacao } from "../utils/paginacao";

interface Parametros {
	municipio?: string;
	estado?: string;
	tempo?: string;
	pagina?: number;
	limite?: number;
}

async function listPorEscalaFarmaciaService(params: Parametros) {
	let { estado, municipio, tempo } = params;

	const filtros: any = {};

	if (!tempo) {
		tempo = new Date().toString();
	}

	let dateTime = new Date(tempo);
	console.log(dateTime);

	if (estado) {
		filtros["endereco.estado"] = estado;
	}

	if (municipio) {
		filtros["endereco.municipio"] = municipio;
	}

	filtros["plantoes.saida"] = { $gte: dateTime };

	const paginacao = {
		pagina: 1,
		limite: 1000,
	};

	const { dados } = await FarmaciaRepository.findFarmacias(filtros, paginacao);

	if (isNaN(Number(dateTime))) {
		throw {
			codigo: 400,
			erro: "Tempo informado inválido",
		};
	}

	let escala: {
		[key: string]: any[];
	} = {};

	dados.map((d) => {
		d.plantoes.map((p) => {
			const dia = p.entrada.toDateString();

			if (escala[dia]) {
				escala[dia].push(d);
			} else {
				escala[dia] = [d];
			}
		});
	});

	const p = extrairPaginacao(params);
	const { limite, pagina } = {
		limite: p.limite || 10,
		pagina: p.pagina || 1,
	};

	const dias = Object.entries(escala);

	const documentos_totais = dias.length;
	const paginas_totais = Math.ceil(documentos_totais / limite);
	const skip = (pagina - 1) * limite;

	const array = dias
		.sort((a, b) => {
			const dataA = Number(new Date(a[0]));
			const dataB = Number(new Date(b[0]));

			return dataA > dataB ? 1 : -1;
		})
		.slice(skip, skip + limite);

	escala = Object.fromEntries(array);

	return {
		escala,
		documentos_totais,
		limite,
		pagina,
		paginas_totais,
	};
}

export default listPorEscalaFarmaciaService;
