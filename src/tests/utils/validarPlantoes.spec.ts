import {
	validarPlantoes,
	validarPlantao,
} from "../../app/utils/validarPlantoes";

describe("validarPlantao", () => {
	it("deve retornar true quando o plantão é válido", () => {
		const plantao = {
			entrada: new Date(2026, 4, 5, 8, 0),
			saida: new Date(2026, 4, 5, 18, 0),
		};

		expect(validarPlantao(plantao)).toBe(true);
	});

	it("deve retornar false quando a data de entrada é inválida", () => {
		const plantao = {
			entrada: new Date("invalid"),
			saida: new Date(2026, 4, 5, 18, 0),
		};

		expect(validarPlantao(plantao)).toBe(false);
	});

	it("deve retornar false quando a saída é anterior à entrada", () => {
		const plantao = {
			entrada: new Date(2026, 4, 5, 18, 0),
			saida: new Date(2026, 4, 5, 8, 0),
		};

		expect(validarPlantao(plantao)).toBe(false);
	});
});

describe("validarPlantoes", () => {
	it("deve retornar array vazio quando todos os plantoes são válidos", () => {
		const plantoes = [
			{
				entrada: new Date(2026, 4, 5, 8, 0),
				saida: new Date(2026, 4, 5, 12, 0),
			},
			{
				entrada: new Date(2026, 4, 5, 14, 0),
				saida: new Date(2026, 4, 5, 18, 0),
			},
		];

		expect(validarPlantoes(plantoes)).toEqual([]);
	});

	it("deve retornar erros apenas para plantoes inválidos", () => {
		const plantoes = [
			{
				entrada: new Date(2026, 4, 5, 8, 0),
				saida: new Date(2026, 4, 5, 12, 0),
			},
			{
				entrada: new Date(2026, 4, 5, 18, 0),
				saida: new Date(2026, 4, 5, 8, 0),
			},
		];

		const resultado = validarPlantoes(plantoes);

		expect(resultado).toHaveLength(1);
		expect(resultado[0]).toMatchObject({
			entrada: new Date(2026, 4, 5, 18, 0),
			saida: new Date(2026, 4, 5, 8, 0),
			mensagem: "Plantão inválido",
		});
	});
});
