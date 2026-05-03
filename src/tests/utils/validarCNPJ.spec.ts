import validarCNPJ from "../../app/utils/validarCNPJ";

describe("validarCNPJ", () => {
	it("deve validar CNPJ válido sem formatação", () => {
		const cnpj = "12345678000195";
		const result = validarCNPJ(cnpj);
		expect(result).toBe(true);
	});

	it("deve validar CNPJ válido com pontos e barras", () => {
		const cnpj = "12.345.678/0001-95";
		const result = validarCNPJ(cnpj);
		expect(result).toBe(true);
	});

	it("deve rejeitar CNPJ vazio", () => {
		const cnpj = "";
		const result = validarCNPJ(cnpj);
		expect(result).toBe(false);
	});

	it("deve rejeitar CNPJ com menos de 14 dígitos", () => {
		const cnpj = "1234567800019";
		const result = validarCNPJ(cnpj);
		expect(result).toBe(false);
	});

	it("deve rejeitar CNPJ com mais de 14 dígitos", () => {
		const cnpj = "123456780001956";
		const result = validarCNPJ(cnpj);
		expect(result).toBe(false);
	});

	it("deve rejeitar CNPJ com caracteres não numéricos", () => {
		const cnpj = "12.345.678/0001-9A";
		const result = validarCNPJ(cnpj);
		expect(result).toBe(false);
	});

	it("deve rejeitar CNPJ com todos os dígitos iguais a 0", () => {
		const cnpj = "00000000000000";
		const result = validarCNPJ(cnpj);
		expect(result).toBe(false);
	});

	it("deve rejeitar CNPJ com todos os dígitos iguais a 1", () => {
		const cnpj = "11111111111111";
		const result = validarCNPJ(cnpj);
		expect(result).toBe(false);
	});

	it("deve rejeitar CNPJ com todos os dígitos iguais a 2", () => {
		const cnpj = "22222222222222";
		const result = validarCNPJ(cnpj);
		expect(result).toBe(false);
	});

	it("deve rejeitar CNPJ com todos os dígitos iguais a 3", () => {
		const cnpj = "33333333333333";
		const result = validarCNPJ(cnpj);
		expect(result).toBe(false);
	});

	it("deve rejeitar CNPJ com todos os dígitos iguais a 4", () => {
		const cnpj = "44444444444444";
		const result = validarCNPJ(cnpj);
		expect(result).toBe(false);
	});

	it("deve rejeitar CNPJ com todos os dígitos iguais a 5", () => {
		const cnpj = "55555555555555";
		const result = validarCNPJ(cnpj);
		expect(result).toBe(false);
	});

	it("deve rejeitar CNPJ com todos os dígitos iguais a 6", () => {
		const cnpj = "66666666666666";
		const result = validarCNPJ(cnpj);
		expect(result).toBe(false);
	});

	it("deve rejeitar CNPJ com todos os dígitos iguais a 7", () => {
		const cnpj = "77777777777777";
		const result = validarCNPJ(cnpj);
		expect(result).toBe(false);
	});

	it("deve rejeitar CNPJ com todos os dígitos iguais a 8", () => {
		const cnpj = "88888888888888";
		const result = validarCNPJ(cnpj);
		expect(result).toBe(false);
	});

	it("deve rejeitar CNPJ com todos os dígitos iguais a 9", () => {
		const cnpj = "99999999999999";
		const result = validarCNPJ(cnpj);
		expect(result).toBe(false);
	});

	it("deve validar CNPJ válido com dígitos variados", () => {
		const cnpj = "11222333000181";
		const result = validarCNPJ(cnpj);
		expect(result).toBe(true);
	});

	it("deve rejeitar CNPJ com primeiro dígito verificador incorreto", () => {
		const cnpj = "12345678000196"; // Último dígito deveria ser 5
		const result = validarCNPJ(cnpj);
		expect(result).toBe(false);
	});

	it("deve rejeitar CNPJ com segundo dígito verificador incorreto", () => {
		const cnpj = "12345678000185"; // Último dígito deveria ser 5
		const result = validarCNPJ(cnpj);
		expect(result).toBe(false);
	});

	it("deve validar CNPJ válido de empresa real", () => {
		// CNPJ de teste válido
		const cnpj = "19131243000197";
		const result = validarCNPJ(cnpj);
		expect(result).toBe(true);
	});
});
