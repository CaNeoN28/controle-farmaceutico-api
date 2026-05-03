import pontoMaisProximo from "../../app/utils/pontoMaisProximo";

describe("pontoMaisProximo", () => {
	it("deve encontrar o ponto mais próximo", () => {
		const localizacao = { x: 0, y: 0 };
		const comparados = [
			{ identificador: "A", localizacao: { x: 3, y: 4 } }, // Distância: 5
			{ identificador: "B", localizacao: { x: 1, y: 1 } }, // Distância: ~1.41
			{ identificador: "C", localizacao: { x: 6, y: 8 } }, // Distância: 10
		];
		
		const result = pontoMaisProximo(localizacao, comparados);

		expect(result).toBeDefined();

		expect(result).toHaveLength(3);
		expect(result![0].identificador).toBe("B");
		expect(result![0].distanciaTotal).toBeCloseTo(1.414, 3);
		expect(result![1].identificador).toBe("A");
		expect(result![1].distanciaTotal).toBe(5);
		expect(result![2].identificador).toBe("C");
		expect(result![2].distanciaTotal).toBe(10);
	});

	it("deve retornar array vazio quando comparados está vazio", () => {
		const localizacao = { x: 0, y: 0 };
		const comparados: any[] = [];

		const result = pontoMaisProximo(localizacao, comparados);

		expect(result).toBeUndefined();
	});

	it("deve calcular distâncias corretamente com coordenadas negativas", () => {
		const localizacao = { x: -2, y: -3 };
		const comparados = [
			{ identificador: "A", localizacao: { x: -5, y: -7 } }, // Distância: 5
			{ identificador: "B", localizacao: { x: 1, y: 2 } },   // Distância: ~5.831
		];

		const result = pontoMaisProximo(localizacao, comparados);

		expect(result).toBeDefined();

		expect(result).toHaveLength(2);
		expect(result![0].identificador).toBe("A");
		expect(result![0].distanciaTotal).toBeCloseTo(5, 3);
		expect(result![1].identificador).toBe("B");
		expect(result![1].distanciaTotal).toBeCloseTo(5.831, 3);
	});

	it("deve ordenar corretamente quando há empates", () => {
		const localizacao = { x: 0, y: 0 };
		const comparados = [
			{ identificador: "A", localizacao: { x: 1, y: 0 } }, // Distância: 1
			{ identificador: "B", localizacao: { x: 0, y: 1 } }, // Distância: 1
			{ identificador: "C", localizacao: { x: 2, y: 0 } }, // Distância: 2
		];

		const result = pontoMaisProximo(localizacao, comparados);

		expect(result).toBeDefined();

		expect(result).toHaveLength(3);
		expect(result![0].distanciaTotal).toBe(1);
		expect(result![1].distanciaTotal).toBe(1);
		expect(result![2].distanciaTotal).toBe(2);
	});

	it("deve funcionar com um único ponto", () => {
		const localizacao = { x: 0, y: 0 };
		const comparados = [
			{ identificador: "A", localizacao: { x: 5, y: 12 } }, // Distância: 13
		];

		const result = pontoMaisProximo(localizacao, comparados);

		expect(result).toBeDefined();

		expect(result).toHaveLength(1);
		expect(result![0].identificador).toBe("A");
		expect(result![0].distanciaTotal).toBe(13);
	});

	it("deve calcular distância zero quando pontos são idênticos", () => {
		const localizacao = { x: 5, y: 10 };
		const comparados = [
			{ identificador: "A", localizacao: { x: 5, y: 10 } }, // Distância: 0
			{ identificador: "B", localizacao: { x: 6, y: 10 } }, // Distância: 1
		];

		const result = pontoMaisProximo(localizacao, comparados);

		expect(result).toBeDefined();

		expect(result).toHaveLength(2);
		expect(result![0].identificador).toBe("A");
		expect(result![0].distanciaTotal).toBe(0);
		expect(result![1].identificador).toBe("B");
		expect(result![1].distanciaTotal).toBe(1);
	});
});
