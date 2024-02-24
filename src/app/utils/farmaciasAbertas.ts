import Farmacia, { HorariosServico } from "../../types/Farmacia";

function encontrarDiaSemana(tempo: Date, horarios_servico: HorariosServico) {
	const dias_semana = [
		"domingo",
		"segunda_feira",
		"terca_feira",
		"quarta_feira",
		"quinta_feira",
		"sexta_feira",
		"sabado",
	];

	const dia = tempo.getDay();
	const dia_semana = dias_semana[dia];

	const getHorarioServico = () => {
		let horario = horarios_servico[dia_semana as keyof HorariosServico];

		if (horario) {
			const { horario_entrada, horario_saida } = horario;
			const { hora, minuto } = {
				hora: tempo.getHours(),
				minuto: tempo.getMinutes(),
			};
			const [horaEntrada, minutoEntrada] = horario_entrada
				.split(":")
				.map((v) => Number(v));
			const [horaSaida, minutoSaida] = horario_saida
				.split(":")
				.map((v) => Number(v));

			if (hora >= horaEntrada && hora <= horaSaida) {
				if (hora == horaEntrada && minuto <= minutoEntrada) return false;

				if (hora == horaSaida && minuto >= minutoSaida) return false;
				else return true;
			}

			return false;
		} else {
			return false;
		}
	};
	const horario_servico = getHorarioServico();

	return horario_servico;
}

function encontrarPlantao(
	tempo: Date,
	plantoes?: { entrada: Date; saida: Date }[]
) {
	if (!plantoes) return false;

	const plantao = plantoes.find((p) => {
		const valido = p.entrada <= tempo && p.saida >= tempo;

		return valido;
	});

	return plantao;
}

function farmaciasAbertas(
	farmacias: (Farmacia & { id: string })[],
	tempo: Date
) {
	farmacias = farmacias.filter((f) => {
		const diaSemana = encontrarDiaSemana(tempo, f.horarios_servico);
		const plantao = encontrarPlantao(tempo, f.plantoes);
		
		if (!diaSemana && !plantao) {
			return false;
		}

		return true;
	});
	return farmacias;
}

export default farmaciasAbertas;
