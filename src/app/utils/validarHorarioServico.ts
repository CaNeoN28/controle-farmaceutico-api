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
