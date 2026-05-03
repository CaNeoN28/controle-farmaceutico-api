import PERMISSOES from "../../app/utils/permissoes";

describe("PERMISSOES", () => {
	it("deve ter as permissões corretas definidas", () => {
		expect(PERMISSOES).toEqual({
			ADMINISTRADOR: 3,
			GERENTE: 2,
			USUARIO: 1,
			INATIVO: 0,
		});
	});

	it("deve ter ADMINISTRADOR com maior permissão", () => {
		expect(PERMISSOES.ADMINISTRADOR).toBe(3);
	});

	it("deve ter GERENTE com permissão intermediária", () => {
		expect(PERMISSOES.GERENTE).toBe(2);
	});

	it("deve ter USUARIO com permissão básica", () => {
		expect(PERMISSOES.USUARIO).toBe(1);
	});

	it("deve ter INATIVO com menor permissão", () => {
		expect(PERMISSOES.INATIVO).toBe(0);
	});
});
