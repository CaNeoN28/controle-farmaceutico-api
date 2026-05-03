import { HorariosServico } from "../../types/Farmacia";

function validarHorarioMaiorMenor(
	horario_entrada: string,
	horario_saida: string,
) {
	const [horaEntrada, minutoEntrada] = horario_entrada
		.split(":")
		.map((v) => Number(v));

	const [horaSaida, minutoSaida] = horario_saida
		.split(":")
		.map((v) => Number(v));

	if (
		horaEntrada > horaSaida ||
		(horaEntrada == horaSaida && minutoEntrada > minutoSaida)
	) {
		return false;
	}

	return true;
}

function validarHorarioServico(horario: string) {
	const regex = /^([0-9]{1,2}):([0-9]{2})$/;

	if (!regex.test(horario)) {
		return false;
	}

	let [horas, minutos] = horario.split(":");

	if (horas && minutos) {
		let valido = false;

		const nhoras = Number(horas);
		const nminutos = Number(minutos);

		if (nhoras <= 24) {
			if (nhoras == 24) {
				if (nminutos == 0) {
					valido = true;
				}
			} else {
				if (nminutos <= 60) valido = true;
			}
		}

		return valido;
	} else return false;
}

function validarDiasServico(diasServico: HorariosServico) {
	const dias = Object.keys(diasServico).map((v) => {
		const diaServico = diasServico[v as keyof HorariosServico];

		if (diaServico)
			return {
				dia_semana: v,
				horario_entrada: diaServico.horario_entrada,
				horario_saida: diaServico.horario_saida,
			};
	});

	const erros = dias
		.map((dia) => {
			if (!dia) return;

			const { horario_entrada, horario_saida } = dia;

			const entradaValida = validarHorarioServico(horario_entrada);
			const saidaValida = validarHorarioServico(horario_saida);

			if (entradaValida && saidaValida) {
				const validacaoMaiorMenor = validarHorarioMaiorMenor(
					horario_entrada,
					horario_saida,
				);

				if (!validacaoMaiorMenor) {
					return {
						[`horarios_servico.${dia?.dia_semana}.horario_entrada`]:
							"Horário de entrada inválido",
						[`horarios_servico.${dia?.dia_semana}.horario_saida`]:
							"Horário de saída inválido",
					};
				}
			} else {
				if (!entradaValida)
					return {
						[`horarios_servico.${dia?.dia_semana}.horario_entrada`]:
							"Horário de entrada inválido",
					};
				if (!saidaValida)
					return {
						[`horarios_servico.${dia?.dia_semana}.horario_saida`]:
							"Horário de saída inválido",
					};
			}
		})
		.filter((v) => v);

	if (erros.length > 0) {
		const erro = erros.reduce((acc, curr) => {
			return {
				...acc,
				...curr,
			};
		});

		return erro;
	}

	return undefined;
}

export default validarDiasServico;
