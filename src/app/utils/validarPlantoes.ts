import { IPlantao } from "../../types/Farmacia";

export function validarPlantao(plantao: IPlantao) {
	const { entrada, saida } = {
		entrada: Number(new Date(plantao.entrada)),
		saida: Number(new Date(plantao.saida)),
	};

	if (isNaN(entrada) || isNaN(saida)) return false;

	if (saida < entrada) return false;

	return true;
}

export function validarPlantoes(plantoes: IPlantao[]) {
	let erro: (IPlantao & { mensagem: string })[] = [];

	plantoes.map(({ entrada, saida }) => {
		if (!validarPlantao({ entrada, saida })) {
			erro.push({
				entrada,
				saida,
				mensagem: "Plantão inválido",
			});
		}
	});

	return erro;
}
