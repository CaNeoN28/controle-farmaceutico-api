import validarCPF from "../../app/utils/validarCPF";

describe("validarCPF", () => {
	it("deve validar CPF válido sem formatação", () => {
		const cpf = "12345678909";
		const result = validarCPF(cpf);
		expect(result).toBe(true);
	});

	it("deve rejeitar CPF vazio", () => {
		const cpf = "";
		const result = validarCPF(cpf);
		expect(result).toBe(false);
	});

	it("deve rejeitar CPF com menos de 11 dígitos", () => {
		const cpf = "1234567890";
		const result = validarCPF(cpf);
		expect(result).toBe(false);
	});

	it("deve rejeitar CPF com mais de 11 dígitos", () => {
		const cpf = "123456789012";
		const result = validarCPF(cpf);
		expect(result).toBe(false);
	});

	it("deve rejeitar CPF com caracteres não numéricos", () => {
		const cpf = "123.456.789-0A";
		const result = validarCPF(cpf);
		expect(result).toBe(false);
	});

	it("deve validar CPF válido com dígitos variados", () => {
		const cpf = "52998224725";
		const result = validarCPF(cpf);
		expect(result).toBe(true);
	});

	it("deve rejeitar CPF com primeiro dígito verificador incorreto", () => {
		const cpf = "12345678900"; // Último dígito deveria ser 9
		const result = validarCPF(cpf);
		expect(result).toBe(false);
	});

	it("deve rejeitar CPF com segundo dígito verificador incorreto", () => {
		const cpf = "12345678919"; // Último dígito deveria ser 9
		const result = validarCPF(cpf);
		expect(result).toBe(false);
	});

	it("deve validar CPF válido de pessoa real", () => {
		// CPF de teste válido
		const cpf = "52998224725";
		const result = validarCPF(cpf);
		expect(result).toBe(true);
	});
});
