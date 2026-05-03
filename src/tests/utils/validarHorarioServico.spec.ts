import validarDiasServico from "../../app/utils/validarHorarioServico";

describe("validarHorarioServico", () => {
	describe("validarHorarioMaiorMenor (função interna)", () => {
		// Como é uma função interna, vamos testar indiretamente através de validarDiasServico
		it("deve aceitar horário de entrada menor que saída", () => {
			const diasServico = {
				segunda_feira: {
					horario_entrada: "08:00",
					horario_saida: "18:00",
				},
			};

			const result = validarDiasServico(diasServico);

			expect(result).toBeUndefined();
		});

		it("deve rejeitar horário de entrada maior que saída", () => {
			const diasServico = {
				segunda_feira: {
					horario_entrada: "18:00",
					horario_saida: "08:00",
				},
			};

			const result = validarDiasServico(diasServico);

			expect(result).toBeDefined();
			expect(result).toMatchObject({
				"horarios_servico.segunda_feira.horario_entrada":
					"Horário de entrada inválido",
				"horarios_servico.segunda_feira.horario_saida":
					"Horário de saída inválido",
			});
		});
	});

	describe("validarHorarioServico (função interna)", () => {
		it("deve aceitar horário válido HH:MM", () => {
			const diasServico = {
				segunda_feira: {
					horario_entrada: "08:30",
					horario_saida: "17:45",
				},
			};

			const result = validarDiasServico(diasServico);

			expect(result).toBeUndefined();
		});

		it("deve aceitar horário 00:00", () => {
			const diasServico = {
				segunda_feira: {
					horario_entrada: "00:00",
					horario_saida: "23:59",
				},
			};

			const result = validarDiasServico(diasServico);

			expect(result).toBeUndefined();
		});

		it("deve aceitar horário 24:00", () => {
			const diasServico = {
				segunda_feira: {
					horario_entrada: "00:00",
					horario_saida: "24:00",
				},
			};

			const result = validarDiasServico(diasServico);

			expect(result).toBeUndefined();
		});

		it("deve rejeitar horário sem dois pontos", () => {
			const diasServico = {
				segunda_feira: {
					horario_entrada: "0830",
					horario_saida: "1745",
				},
			};

			const result = validarDiasServico(diasServico);

			expect(result).toBeDefined();
			expect(result).toMatchObject({
				"horarios_servico.segunda_feira.horario_entrada":
					"Horário de entrada inválido",
			});
		});

		it("deve rejeitar horário com hora maior que 24", () => {
			const diasServico = {
				segunda_feira: {
					horario_entrada: "25:00",
					horario_saida: "26:00",
				},
			};

			const result = validarDiasServico(diasServico);

			expect(result).toBeDefined();
			expect(result).toMatchObject({
				"horarios_servico.segunda_feira.horario_entrada":
					"Horário de entrada inválido",
			});
		});

		it("deve rejeitar horário com minutos maiores que 60", () => {
			const diasServico = {
				segunda_feira: {
					horario_entrada: "08:61",
					horario_saida: "17:00",
				},
			};

			const result = validarDiasServico(diasServico);

			expect(result).toBeDefined();
			expect(result).toMatchObject({
				"horarios_servico.segunda_feira.horario_entrada":
					"Horário de entrada inválido",
			});
		});
	});

	describe("validarDiasServico", () => {
		it("deve aceitar dias de serviço válidos", () => {
			const diasServico = {
				segunda_feira: {
					horario_entrada: "08:00",
					horario_saida: "18:00",
				},
				terca_feira: {
					horario_entrada: "08:00",
					horario_saida: "18:00",
				},
			};

			const result = validarDiasServico(diasServico);

			expect(result).toBeUndefined();
		});

		it("deve aceitar objeto vazio", () => {
			const diasServico = {};

			const result = validarDiasServico(diasServico);

			expect(result).toBeUndefined();
		});

		it("deve aceitar dia sem horário definido", () => {
			const diasServico = {
				segunda_feira: undefined,
			};

			const result = validarDiasServico(diasServico);

			expect(result).toBeUndefined();
		});

		it("deve rejeitar horário de entrada inválido", () => {
			const diasServico = {
				segunda_feira: {
					horario_entrada: "25:00",
					horario_saida: "18:00",
				},
			};

			const result = validarDiasServico(diasServico);

			expect(result).toBeDefined();
			expect(result).toMatchObject({
				"horarios_servico.segunda_feira.horario_entrada":
					"Horário de entrada inválido",
			});
		});

		it("deve rejeitar horário de saída inválido", () => {
			const diasServico = {
				segunda_feira: {
					horario_entrada: "08:00",
					horario_saida: "25:00",
				},
			};

			const result = validarDiasServico(diasServico);

			expect(result).toBeDefined();
			expect(result).toMatchObject({
				"horarios_servico.segunda_feira.horario_saida":
					"Horário de saída inválido",
			});
		});

		it("deve rejeitar quando entrada é maior que saída", () => {
			const diasServico = {
				segunda_feira: {
					horario_entrada: "18:00",
					horario_saida: "08:00",
				},
			};

			const result = validarDiasServico(diasServico);

			expect(result).toBeDefined();
			expect(result).toMatchObject({
				"horarios_servico.segunda_feira.horario_entrada":
					"Horário de entrada inválido",
				"horarios_servico.segunda_feira.horario_saida":
					"Horário de saída inválido",
			});
		});

		it("deve aceitar minutos iguais quando horas são diferentes", () => {
			const diasServico = {
				segunda_feira: {
					horario_entrada: "08:30",
					horario_saida: "17:30",
				},
			};

			const result = validarDiasServico(diasServico);

			expect(result).toBeUndefined();
		});

		it("deve aceitar minutos diferentes", () => {
			const diasServico = {
				segunda_feira: {
					horario_entrada: "08:15",
					horario_saida: "17:45",
				},
			};

			const result = validarDiasServico(diasServico);

			expect(result).toBeUndefined();
		});

		it("deve funcionar com todos os dias da semana", () => {
			const diasServico = {
				domingo: {
					horario_entrada: "08:00",
					horario_saida: "18:00",
				},
				segunda_feira: {
					horario_entrada: "08:00",
					horario_saida: "18:00",
				},
				terca_feira: {
					horario_entrada: "08:00",
					horario_saida: "18:00",
				},
				quarta_feira: {
					horario_entrada: "08:00",
					horario_saida: "18:00",
				},
				quinta_feira: {
					horario_entrada: "08:00",
					horario_saida: "18:00",
				},
				sexta_feira: {
					horario_entrada: "08:00",
					horario_saida: "18:00",
				},
				sabado: {
					horario_entrada: "08:00",
					horario_saida: "18:00",
				},
			};

			const result = validarDiasServico(diasServico);

			expect(result).toBeUndefined();
		});
	});
});
