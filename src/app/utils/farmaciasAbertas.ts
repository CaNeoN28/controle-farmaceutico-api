import Farmacia, { HorariosServico } from "../../types/Farmacia";

function encontrarDiaSemana(tempo: string, horarios_servico: HorariosServico) {
	const dias_semana = [
		"domingo",
		"segunda_feira",
		"terca_feira",
		"quarta_feira",
		"quinta_feira",
		"sexta_feira",
		"sabado",
	];

	const dia = new Date(tempo).getDay();
	const dia_semana = dias_semana[dia];

	const horario_servico = horarios_servico[dia_semana as keyof HorariosServico];

	return horario_servico;
}

function encontrarPlantao(tempo: string, plantoes?: string[]) {
	if (!plantoes) return false;

	const plantao = plantoes.find((p) => {
		const plantao = new Date(p).getTime();
		const diaProximo = () => {
			const dateTime = new Date(tempo);

			const hora = dateTime.getHours();
			let { dia, mes, ano } = {
				dia: dateTime.getDate(),
				mes: dateTime.getMonth() + 1,
				ano: dateTime.getFullYear(),
			};

			if (hora < 7) {
				if (dia == 1) {
					mes--;

					if (mes == 0) {
						ano--;
						mes = 12;
					}
					if (mes == 2) {
						dia = ano % 4 == 0 ? 29 : 28;
					} else if ([1, 3, 5, 7, 8, 10, 12].includes(mes)) {
						dia = 31;
					} else {
						dia = 30;
					}
				} else {
					dia--;
				}
			}
			const data = new Date([ano, mes, dia].join("/"));
			console.log(data);
			return data.getTime();
		};

		return diaProximo() === plantao;
	});

	return plantao;
}

function farmaciasAbertas(
	farmacias: (Farmacia & { id: string })[],
	tempo: string
) {
	farmacias = farmacias.filter((f) => {
		const diaSemana = encontrarDiaSemana(tempo, f.horarios_servico);
		const plantao = encontrarPlantao(tempo, f.plantoes);
		if (!diaSemana && !plantao) {
			return false;
		}

		return true;
	});
	console.log(farmacias);
	return farmacias;
}

export default farmaciasAbertas;
