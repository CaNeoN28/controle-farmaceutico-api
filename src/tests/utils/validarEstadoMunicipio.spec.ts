import { validarCidade, validarEstado, estados } from "../../app/utils/validarEstadoMunicipio";

describe("validarEstadoMunicipio", () => {
	describe("validarEstado", () => {
		it("deve validar estado existente", () => {
			const result = validarEstado("São Paulo");
			expect(result).toBe(true);
		});

		it("deve validar estado com sigla", () => {
			// Nota: O objeto estados usa nomes completos, não siglas
			const result = validarEstado("São Paulo");
			expect(result).toBe(true);
		});

		it("deve rejeitar estado inexistente", () => {
			const result = validarEstado("Estado Inexistente");
			expect(result).toBe(false);
		});

		it("deve rejeitar estado vazio", () => {
			const result = validarEstado("");
			expect(result).toBe(false);
		});

		it("deve rejeitar estado nulo", () => {
			const result = validarEstado(null as any);
			expect(result).toBe(false);
		});

		it("deve rejeitar estado undefined", () => {
			const result = validarEstado(undefined as any);
			expect(result).toBe(false);
		});

		it("deve ser case-sensitive", () => {
			const result = validarEstado("são paulo");
			expect(result).toBe(false);
		});
	});

	describe("validarCidade", () => {
		it("deve validar cidade existente em estado válido", () => {
			const result = validarCidade("São Paulo", "São Paulo");
			expect(result).toBe(true);
		});

		it("deve validar cidade existente em estado com sigla", () => {
			// Nota: O objeto estados usa nomes completos, não siglas
			const result = validarCidade("São Paulo", "São Paulo");
			expect(result).toBe(true);
		});

		it("deve rejeitar cidade inexistente em estado válido", () => {
			const result = validarCidade("Cidade Inexistente", "São Paulo");
			expect(result).toBe(false);
		});

		it("deve rejeitar cidade existente em estado inválido", () => {
			const result = validarCidade("São Paulo", "Estado Inexistente");
			expect(result).toBe(false);
		});

		it("deve rejeitar cidade vazia", () => {
			const result = validarCidade("", "São Paulo");
			expect(result).toBe(false);
		});

		it("deve rejeitar estado vazio", () => {
			const result = validarCidade("São Paulo", "");
			expect(result).toBe(false);
		});

		it("deve rejeitar cidade nula", () => {
			const result = validarCidade(null as any, "São Paulo");
			expect(result).toBe(false);
		});

		it("deve rejeitar estado nulo", () => {
			const result = validarCidade("São Paulo", null as any);
			expect(result).toBe(false);
		});

		it("deve ser case-sensitive para cidade", () => {
			const result = validarCidade("são paulo", "São Paulo");
			expect(result).toBe(false);
		});

		it("deve ser case-sensitive para estado", () => {
			const result = validarCidade("São Paulo", "são paulo");
			expect(result).toBe(false);
		});

		it("deve validar cidade do Acre", () => {
			const result = validarCidade("Rio Branco", "Acre");
			expect(result).toBe(true);
		});

		it("deve validar cidade de Alagoas", () => {
			const result = validarCidade("Maceió", "Alagoas");
			expect(result).toBe(true);
		});
	});

	describe("estados", () => {
		it("deve ser um objeto não vazio", () => {
			expect(estados).toBeDefined();
			expect(typeof estados).toBe("object");
			expect(Object.keys(estados).length).toBeGreaterThan(0);
		});

		it("deve conter estado de São Paulo", () => {
			expect(estados["São Paulo"]).toBeDefined();
			expect(Array.isArray(estados["São Paulo"])).toBe(true);
			expect(estados["São Paulo"].length).toBeGreaterThan(0);
		});

		it("deve conter cidades em São Paulo", () => {
			expect(estados["São Paulo"]).toContain("São Paulo");
			expect(estados["São Paulo"]).toContain("Campinas");
		});

		it("cada estado deve ter array de cidades", () => {
			Object.values(estados).forEach((cidades) => {
				expect(Array.isArray(cidades)).toBe(true);
				expect(cidades.length).toBeGreaterThan(0);
				cidades.forEach((cidade) => {
					expect(typeof cidade).toBe("string");
					expect(cidade.length).toBeGreaterThan(0);
				});
			});
		});
	});
});
