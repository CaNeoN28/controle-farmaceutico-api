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

function farmaciasAbertas(
	farmacias: (Farmacia & { id: string })[],
	tempo: string
) {
	farmacias = farmacias.filter((f) => {
		const diaSemana = encontrarDiaSemana(tempo, f.horarios_servico);
		if (!diaSemana) {
			return false;
		}

		return true;
	});
	
	console.log(farmacias)
	return farmacias;
}

export default farmaciasAbertas;
