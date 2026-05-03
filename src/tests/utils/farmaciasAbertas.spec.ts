import {
	encontrarDiaSemana,
	encontrarPlantao,
	farmaciasAbertas
} from "../../app/utils/farmaciasAbertas";
import { HorariosServico } from "../../types/Farmacia";

describe("encontrarDiaSemana", () => {
	const horarios_servico: HorariosServico = {
		segunda_feira: {
			horario_entrada: "08:00",
			horario_saida: "18:00",
		},
	};

	it("deve retornar true quando o horário está dentro do período", () => {
		const tempo = new Date(2026, 4, 4, 9, 30);

		expect(encontrarDiaSemana(tempo, horarios_servico)).toBe(true);
	});

	it("deve retornar false quando o horário é exatamente no início do período", () => {
		const tempo = new Date(2026, 4, 4, 8, 0);

		expect(encontrarDiaSemana(tempo, horarios_servico)).toBe(false);
	});

	it("deve retornar false quando não há horário de serviço no dia", () => {
		const tempo = new Date(2026, 4, 5, 10, 0); // terça-feira

		expect(encontrarDiaSemana(tempo, horarios_servico)).toBe(false);
	});
});

describe("encontrarPlantao", () => {
	const plantoes = [
		{
			entrada: new Date(2026, 4, 4, 18, 0),
			saida: new Date(2026, 4, 4, 23, 0),
		},
	];

	it("deve retornar o plantão ativo quando o tempo está dentro do intervalo", () => {
		const tempo = new Date(2026, 4, 4, 19, 0);

		expect(encontrarPlantao(tempo, plantoes)).toEqual(plantoes[0]);
	});

	it("deve retornar undefined quando não existe plantão ativo", () => {
		const tempo = new Date(2026, 4, 4, 17, 59);

		expect(encontrarPlantao(tempo, plantoes)).toBeUndefined();
	});

	it("deve retornar false quando não há plantoes", () => {
		const tempo = new Date(2026, 4, 4, 19, 0);

		expect(encontrarPlantao(tempo)).toBe(false);
	});
});

describe("farmaciasAbertas", () => {
	const baseFarmacia = {
		id: "1",
		cnpj: "12.345.678/0001-90",
		nome_fantasia: "Farmacia Teste",
		endereco: {
			cep: "00000-000",
			estado: "SP",
			municipio: "São Paulo",
			bairro: "Centro",
			logradouro: "Rua Teste",
			numero: "100",
			localizacao: { x: "0", y: "0" },
		},
	} as const;

	it("deve retornar	 apenas farmácias com horário de serviço ativo", () => {
		const farmacias = [
			{
				...baseFarmacia,
				horarios_servico: {
					segunda_feira: {
						horario_entrada: "08:00",
						horario_saida: "18:00",
					},
				},
			},
			{
				...baseFarmacia,
				id: "2",
				horarios_servico: {
					martes: {
						horario_entrada: "08:00",
						horario_saida: "18:00",
					},
				},
			},
		];

		const abertas = farmaciasAbertas(farmacias as any, new Date(2026, 4, 4, 9, 0));

		expect(abertas).toHaveLength(1);
		expect(abertas[0].id).toBe("1");
	});

	it("deve retornar farmácia aberta por plantão mesmo com horário fechado", () => {
		const farmacias = [
			{
				...baseFarmacia,
				id: "3",
				horarios_servico: {
					terça_feira: {
						horario_entrada: "08:00",
						horario_saida: "18:00",
					},
				},
				plantoes: [
					{
						entrada: new Date(2026, 4, 4, 20, 0),
						saida: new Date(2026, 4, 4, 23, 0),
					},
				],
			},
		];

		const abertas = farmaciasAbertas(farmacias as any, new Date(2026, 4, 4, 21, 0));

		expect(abertas).toHaveLength(1);
		expect(abertas[0].id).toBe("3");
	});

	it("deve retornar lista vazia quando não há farmácias abertas", () => {
		const farmacias = [
			{
				...baseFarmacia,
				id: "4",
				horarios_servico: {
					quarta_feira: {
						horario_entrada: "08:00",
						horario_saida: "18:00",
					},
				},
			},
		];

		const abertas = farmaciasAbertas(farmacias as any, new Date(2026, 4, 4, 21, 0));

		expect(abertas).toHaveLength(0);
	});
});
