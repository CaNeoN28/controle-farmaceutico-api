import mongoose from "mongoose";
import ImagemModel from "../../app/models/Imagem";

const dados = {
	_id: new mongoose.Types.ObjectId(),
	finalidade: "farmacia",
	id_finalidade: new mongoose.Types.ObjectId().toString(),
	caminho_imagem: "farmacia/imagem-123.jpg",
	confirmacao_expira: new Date("2026-05-10"),
};

describe("O modelo de imagem", () => {
	it("deve cadastrar uma imagem com os dados informados", () => {
		const imagem = new ImagemModel(dados);
		const erros = imagem.validateSync();

		expect(erros).toBeUndefined();
		expect(imagem).toMatchObject({
			finalidade: dados.finalidade,
			id_finalidade: dados.id_finalidade,
			caminho_imagem: dados.caminho_imagem,
		});
	});

	it("deve realizar validação dos atributos obrigatórios", () => {
		const imagem = new ImagemModel({});

		const validar = () => {
			const erro = imagem.validateSync()!;
			const { finalidade, caminho_imagem } = erro.errors;

			return {
				finalidade: finalidade.message,
				caminho_imagem: caminho_imagem.message,
			};
		};

		expect(validar).not.toThrow();

		const erros = validar();

		expect(erros).toHaveProperty("finalidade");
		expect(erros).toHaveProperty("caminho_imagem");
	});

	it("deve verificar atributos inválidos", () => {
		const imagem = new ImagemModel({
			finalidade: "invalido",
			caminho_imagem: "",
		});

		const validar = () => {
			const erro = imagem.validateSync()!;
			const { finalidade, caminho_imagem } = erro.errors;

			return {
				finalidade: finalidade?.message,
				caminho_imagem: caminho_imagem?.message,
			};
		};

		expect(validar).not.toThrow();

		const erros = validar();

		expect(erros.finalidade).toBeDefined();
	});

	it("deve aceitar finalidade como 'farmacia'", () => {
		const imagem = new ImagemModel({
			finalidade: "farmacia",
			caminho_imagem: "farmacia/123.jpg",
		});

		const erros = imagem.validateSync();

		expect(erros).toBeUndefined();
		expect(imagem.finalidade).toBe("farmacia");
	});

	it("deve aceitar finalidade como 'usuario'", () => {
		const imagem = new ImagemModel({
			finalidade: "usuario",
			caminho_imagem: "usuario/456.jpg",
		});

		const erros = imagem.validateSync();

		expect(erros).toBeUndefined();
		expect(imagem.finalidade).toBe("usuario");
	});

	it("deve aceitar id_finalidade como opcional", () => {
		const imagem = new ImagemModel({
			finalidade: "farmacia",
			caminho_imagem: "farmacia/789.jpg",
		});

		const erros = imagem.validateSync();

		expect(erros).toBeUndefined();
		expect(imagem.id_finalidade).toBeUndefined();
	});

	it("deve aceitar confirmacao_expira como opcional", () => {
		const imagem = new ImagemModel({
			finalidade: "usuario",
			caminho_imagem: "usuario/abc.jpg",
		});

		const erros = imagem.validateSync();

		expect(erros).toBeUndefined();
		expect(imagem.confirmacao_expira).toBeUndefined();
	});

	it("deve aceitar confirmacao_expira como data válida", () => {
		const dataExpiracao = new Date("2026-12-31");

		const imagem = new ImagemModel({
			finalidade: "farmacia",
			caminho_imagem: "farmacia/def.jpg",
			confirmacao_expira: dataExpiracao,
		});

		const erros = imagem.validateSync();

		expect(erros).toBeUndefined();
		expect(imagem.confirmacao_expira).toEqual(dataExpiracao);
	});

	it("deve rejeitar finalidade inválida fora do enum", () => {
		const imagem = new ImagemModel({
			finalidade: "produto",
			caminho_imagem: "produto/123.jpg",
		});

		const erros = imagem.validateSync();

		expect(erros).toBeDefined();
		expect(erros!.errors.finalidade).toBeDefined();
	});

	it("deve rejeitar caminho_imagem vazio", () => {
		const imagem = new ImagemModel({
			finalidade: "farmacia",
			caminho_imagem: "",
		});

		const erros = imagem.validateSync();

		expect(erros).toBeDefined();
		expect(erros!.errors.caminho_imagem).toBeDefined();
	});
});
