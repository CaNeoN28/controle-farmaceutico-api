import mongoose from "mongoose";
import UsuarioRepository from "../../app/repositories/Usuario.repository";
import UsuarioModel from "../../app/models/Usuario";
import { compararSenha } from "../../app/utils/senhas";
import { validarID } from "../../app/utils/validators";
import { erroParaDicionario } from "../../app/utils/mongooseErrors";
import EntidadeRepository from "../../app/repositories/Entidade.repository";

jest.mock("../../app/models/Usuario", () => {
	const mock: any = jest.fn();
	mock.findOne = jest.fn();
	mock.findById = jest.fn();
	mock.findByIdAndUpdate = jest.fn();
	mock.find = jest.fn();
	mock.countDocuments = jest.fn();
	return {
		__esModule: true,
		default: mock,
	};
});

jest.mock("../../app/utils/senhas", () => ({
	compararSenha: jest.fn(),
}));

jest.mock("../../app/utils/validators", () => ({
	validarID: jest.fn(),
}));

jest.mock("../../app/utils/mongooseErrors", () => ({
	erroParaDicionario: jest.fn(),
}));

jest.mock("../../app/repositories/Entidade.repository", () => ({
	__esModule: true,
	default: {
		findEntidade: jest.fn(),
		createEntidade: jest.fn(),
	},
}));

type MockUsuarioModelType = jest.Mock & {
	findOne: jest.Mock;
	findById: jest.Mock;
	findByIdAndUpdate: jest.Mock;
	find: jest.Mock;
	countDocuments: jest.Mock;
};

const MockUsuarioModel = UsuarioModel as unknown as MockUsuarioModelType;
const MockCompararSenha = compararSenha as jest.Mock;
const MockValidarID = validarID as jest.Mock;
const MockErroParaDicionario = erroParaDicionario as jest.Mock;
const MockEntidadeRepository = EntidadeRepository as unknown as {
	findEntidade: jest.Mock;
	createEntidade: jest.Mock;
};

const mockUsuarioInstance = {
	save: jest.fn(),
	updateOne: jest.fn(),
	deleteOne: jest.fn(),
	toObject: jest.fn(),
};

describe("UsuarioRepository - Login", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		MockUsuarioModel.mockImplementation(() => mockUsuarioInstance);
		mockUsuarioInstance.toObject.mockReturnValue({ id: "user123" });
	});

	it("deve realizar login com senha correta", async () => {
		const usuarioDoc = {
			senha: "hash",
			toObject: jest.fn().mockReturnValue({ nome_usuario: "user" }),
		};
		MockUsuarioModel.findOne.mockResolvedValue(usuarioDoc);
		MockCompararSenha.mockResolvedValue(true);

		const result = await UsuarioRepository.login({
			nome_usuario: "user",
			senha: "senha",
		});

		expect(MockUsuarioModel.findOne).toHaveBeenCalledWith({
			nome_usuario: "user",
		});
		expect(result).toEqual({
			usuario: { nome_usuario: "user" },
			senhaCorreta: true,
		});
	});

	it("deve retornar senhaCorreta false quando usuário não existe", async () => {
		MockUsuarioModel.findOne.mockResolvedValue(undefined);

		const result = await UsuarioRepository.login({
			nome_usuario: "user",
			senha: "senha",
		});

		expect(result).toEqual({ usuario: undefined, senhaCorreta: false });
	});

	it("deve retornar senhaCorreta false quando a senha estiver incorreta", async () => {
		const usuarioDoc = {
			senha: "hash",
			toObject: jest.fn().mockReturnValue({ nome_usuario: "user" }),
		};
		MockUsuarioModel.findOne.mockResolvedValue(usuarioDoc);
		MockCompararSenha.mockResolvedValue(false);

		const result = await UsuarioRepository.login({
			nome_usuario: "user",
			senha: "senha",
		});

		expect(result).toEqual({
			usuario: { nome_usuario: "user" },
			senhaCorreta: false,
		});
	});
});

describe("UsuarioRepository - Encontrar Usuario por ID", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		MockUsuarioModel.mockImplementation(() => mockUsuarioInstance);
		mockUsuarioInstance.toObject.mockReturnValue({ id: "user123" });
	});

	it("deve retornar usuário por id quando válido", async () => {
		jest.spyOn(mongoose, "isValidObjectId").mockReturnValue(true);
		MockUsuarioModel.findById.mockReturnValue({
			populate: jest.fn().mockResolvedValue({ nome_usuario: "user" }),
		});

		const result = await UsuarioRepository.findUsuarioId("valid-id");

		expect(result).toEqual({ nome_usuario: "user" });
	});
});

describe("UsuarioRepository - Encontrar Usuario", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		MockUsuarioModel.mockImplementation(() => mockUsuarioInstance);
		mockUsuarioInstance.toObject.mockReturnValue({ id: "user123" });
	});

	it("deve buscar usuário com populate", async () => {
		const expectedUsuario = { nome_usuario: "user" };
		MockUsuarioModel.findOne.mockReturnValue({
			populate: jest.fn().mockResolvedValue(expectedUsuario),
		});

		const result = await UsuarioRepository.findUsuario({
			email: "user@test.com",
		});

		expect(result).toEqual(expectedUsuario);
	});

	it("deve lançar erro quando id de usuário for inválido", async () => {
		jest.spyOn(mongoose, "isValidObjectId").mockReturnValue(false);

		await expect(UsuarioRepository.findUsuarioId("invalid-id")).rejects.toEqual(
			{ codigo: 400, erro: "Id inválido" },
		);
	});

	it("deve listar usuários com paginação", async () => {
		MockUsuarioModel.countDocuments.mockResolvedValue(2);
		MockUsuarioModel.find.mockReturnValue({
			limit: jest.fn().mockReturnThis(),
			skip: jest.fn().mockReturnThis(),
			populate: jest.fn().mockResolvedValue(["user1"]),
		});

		const result = await UsuarioRepository.findUsuarios(
			{ email: "user@test.com" },
			{ limite: 1, pagina: 1 },
			"user123",
		);

		expect(result.dados).toEqual(["user1"]);
		expect(result.documentos_totais).toBe(2);
	});
});

describe("UsuarioRepository - Criar Usuário", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		MockUsuarioModel.mockImplementation(() => mockUsuarioInstance);
		mockUsuarioInstance.toObject.mockReturnValue({ id: "user123" });
	});

	it("deve retornar erro quando criador não tem permissão para criar usuário de nível maior", async () => {
		MockUsuarioModel.findById.mockResolvedValue({
			dados_administrativos: { funcao: "USUARIO" },
		});
		MockUsuarioModel.find.mockResolvedValue([{}]);
		MockUsuarioModel.findOne.mockResolvedValue(null);

		const result = await UsuarioRepository.createUsuario(
			{
				email: "user@test.com",
				nome_usuario: "user",
				senha: "senha",
				numero_registro: "123",
				cpf: "123",
				dados_administrativos: {
					funcao: "GERENTE",
					entidade_relacionada: "ent1",
				},
			} as any,
			"creatorId",
		);

		expect(result.erro).toEqual({
			codigo: 403,
			erro: {
				"dados_administrativos.funcao":
					"Não é possível criar um usuário com nível maior que o seu",
			},
		});
	});

	it("deve retornar erro 409 quando email já estiver cadastrado", async () => {
		MockUsuarioModel.findById.mockResolvedValue({
			dados_administrativos: { funcao: "ADMINISTRADOR" },
		});
		MockUsuarioModel.find.mockResolvedValue([{}]);
		MockUsuarioModel.findOne
			.mockResolvedValueOnce({})
			.mockResolvedValueOnce(undefined);

		const result = await UsuarioRepository.createUsuario(
			{
				email: "user@test.com",
				nome_usuario: "user",
				senha: "senha",
				numero_registro: "123",
				cpf: "123",
				dados_administrativos: {
					funcao: "USUARIO",
					entidade_relacionada: "ent1",
				},
			} as any,
			"creatorId",
		);

		expect(result.erro).toEqual({
			codigo: 409,
			erro: { email: "Email já cadastrado", nome_usuario: undefined },
		});
	});

	it("deve criar usuário com sucesso quando não houver conflito", async () => {
		MockUsuarioModel.findById.mockResolvedValue({
			dados_administrativos: { funcao: "ADMINISTRADOR" },
		});
		MockUsuarioModel.find.mockResolvedValue([{}]);
		MockUsuarioModel.findOne.mockResolvedValue(null);
		mockUsuarioInstance.save.mockResolvedValue(undefined);
		mockUsuarioInstance.toObject.mockReturnValue({ id: "user123" });

		const result = await UsuarioRepository.createUsuario(
			{
				email: "user@test.com",
				nome_usuario: "user",
				senha: "senha",
				numero_registro: "123",
				cpf: "123",
				dados_administrativos: {
					funcao: "USUARIO",
					entidade_relacionada: "ent1",
				},
			} as any,
			"creatorId",
		);

		expect(result).toEqual({ usuario: { id: "user123" }, erro: undefined });
	});

	it("deve retornar erro quando save do usuário lançar exceção", async () => {
		MockUsuarioModel.findById.mockResolvedValue({
			dados_administrativos: { funcao: "ADMINISTRADOR" },
		});
		MockUsuarioModel.find.mockResolvedValue([{}]);
		MockUsuarioModel.findOne.mockResolvedValue(null);
		mockUsuarioInstance.save.mockRejectedValue(new Error("Falha"));
		MockErroParaDicionario.mockReturnValue({
			codigo: 400,
			erros: { email: "Inválido" },
		});

		const result = await UsuarioRepository.createUsuario(
			{
				email: "user@test.com",
				nome_usuario: "user",
				senha: "senha",
				numero_registro: "123",
				cpf: "123",
				dados_administrativos: {
					funcao: "USUARIO",
					entidade_relacionada: "ent1",
				},
			} as any,
			"creatorId",
		);

		expect(result.erro).toEqual({ codigo: 400, erro: { email: "Inválido" } });
	});
});

describe("UsuarioRepository - Update Usuario", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		MockUsuarioModel.mockImplementation(() => mockUsuarioInstance);
		mockUsuarioInstance.toObject.mockReturnValue({ id: "user123" });
	});

	it("deve retornar erro 404 ao atualizar usuário inexistente", async () => {
		MockUsuarioModel.findById
			.mockResolvedValueOnce(undefined)
			.mockResolvedValueOnce({
				dados_administrativos: { funcao: "ADMINISTRADOR" },
			});
		MockUsuarioModel.findOne.mockResolvedValue(null);

		const result = await UsuarioRepository.updateUsuario(
			"id",
			{ nome_usuario: "novo" },
			"gerenciadorId",
		);

		expect(result).toEqual({
			usuario: undefined,
			erros: { codigo: 404, erro: "Usuário não encontrado" },
		});
	});

	it("deve retornar erro 403 quando gerenciador não pode alterar usuário superior", async () => {
		const usuario = {
			dados_administrativos: { funcao: "GERENTE" },
			updateOne: jest.fn(),
		};
		const gerenciador = { dados_administrativos: { funcao: "USUARIO" } };
		MockUsuarioModel.findById
			.mockResolvedValueOnce(usuario)
			.mockResolvedValueOnce(gerenciador);
		MockUsuarioModel.findOne.mockResolvedValue(null);

		const result = await UsuarioRepository.updateUsuario(
			"id",
			{ nome_usuario: "novo" },
			"gerenciadorId",
		);

		expect(result.erros).toEqual({
			codigo: 403,
			erro: "Não é possível alterar os dados de um usuário de nível superior",
		});
	});

	it("deve atualizar usuário com sucesso", async () => {
		const usuario = {
			dados_administrativos: { funcao: "USUARIO" },
			updateOne: jest.fn().mockResolvedValue(undefined),
		};
		const gerenciador = { dados_administrativos: { funcao: "ADMINISTRADOR" } };
		const updatedUser = { nome_usuario: "novo" };
		MockUsuarioModel.findById
			.mockResolvedValueOnce(usuario)
			.mockResolvedValueOnce(gerenciador)
			.mockResolvedValueOnce(updatedUser);
		MockUsuarioModel.findOne.mockResolvedValue(null);

		const result = await UsuarioRepository.updateUsuario(
			"id",
			{ nome_usuario: "novo" },
			"gerenciadorId",
		);

		expect(usuario.updateOne).toHaveBeenCalledWith(
			{ nome_usuario: "novo" },
			{ runValidators: true },
		);
		expect(result).toEqual({ usuario: updatedUser, erros: undefined });
	});

	it("deve retornar erro quando updateOne de usuário falha", async () => {
		const usuario = {
			dados_administrativos: { funcao: "USUARIO" },
			updateOne: jest.fn().mockRejectedValue(new Error("Falha")),
		};
		const gerenciador = { dados_administrativos: { funcao: "ADMINISTRADOR" } };
		MockUsuarioModel.findById
			.mockResolvedValueOnce(usuario)
			.mockResolvedValueOnce(gerenciador);
		MockUsuarioModel.findOne.mockResolvedValue(null);
		MockErroParaDicionario.mockReturnValue({
			codigo: 400,
			erros: { nome_usuario: "Inválido" },
		});

		const result = await UsuarioRepository.updateUsuario(
			"id",
			{ nome_usuario: "novo" },
			"gerenciadorId",
		);

		expect(result.erros).toEqual({
			codigo: 400,
			erro: { nome_usuario: "Inválido" },
		});
	});
});

describe("UsuarioRepository - Auto Atualização", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		MockUsuarioModel.mockImplementation(() => mockUsuarioInstance);
		mockUsuarioInstance.toObject.mockReturnValue({ id: "user123" });
	});

	it("deve retornar erro 409 quando selfUpdate encontra conflito de email ou nome", async () => {
		MockUsuarioModel.findOne.mockResolvedValueOnce({});

		const result = await UsuarioRepository.selfUpdateUsuario("id", {
			email: "user@test.com",
		});

		expect(result.erros).toEqual({
			codigo: 409,
			erro: { email: "Email já cadastrado", nome_usuario: undefined },
		});
	});

	it("deve retornar erro 404 quando selfUpdate não encontra usuário", async () => {
		MockUsuarioModel.findOne.mockResolvedValue(null);
		MockUsuarioModel.findByIdAndUpdate.mockResolvedValue(null);

		const result = await UsuarioRepository.selfUpdateUsuario("id", {
			email: "user@test.com",
		});

		expect(result.erros).toEqual({
			codigo: 404,
			erro: "Usuário não encontrado",
		});
	});

	it("deve atualizar o próprio usuário com sucesso", async () => {
		MockUsuarioModel.findOne.mockResolvedValue(null);
		MockUsuarioModel.findByIdAndUpdate.mockResolvedValue({ id: "user123" });

		const result = await UsuarioRepository.selfUpdateUsuario("id", {
			nome_usuario: "novo",
		});

		expect(result.usuario).toEqual({ id: "user123" });
	});
});

describe("UsuarioRepository - Deletar Usuário", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		MockUsuarioModel.mockImplementation(() => mockUsuarioInstance);
		mockUsuarioInstance.toObject.mockReturnValue({ id: "user123" });
	});

	it("deve retornar erro 400 quando id de usuário for inválido na exclusão", async () => {
		MockValidarID.mockReturnValue(false);

		const result = await UsuarioRepository.deleteUsuario(
			"invalid-id",
			"gerenciadorId",
		);

		expect(result.erro).toEqual({ codigo: 400, erro: "Id inválido" });
	});

	it("deve retornar erro 404 quando usuário para exclusão não existir", async () => {
		MockValidarID.mockReturnValue(true);
		MockUsuarioModel.findById
			.mockResolvedValueOnce(undefined)
			.mockResolvedValueOnce({
				dados_administrativos: { funcao: "ADMINISTRADOR" },
			});

		const result = await UsuarioRepository.deleteUsuario("id", "gerenciadorId");

		expect(result.erro).toEqual({
			codigo: 404,
			erro: "Usuário não encontrado",
		});
	});

	it("deve retornar erro 403 quando tentar remover usuário superior", async () => {
		MockValidarID.mockReturnValue(true);
		MockUsuarioModel.findById
			.mockResolvedValueOnce({
				dados_administrativos: { funcao: "GERENTE" },
				deleteOne: jest.fn(),
			})
			.mockResolvedValueOnce({ dados_administrativos: { funcao: "USUARIO" } });

		const result = await UsuarioRepository.deleteUsuario("id", "gerenciadorId");

		expect(result.erro).toEqual({
			codigo: 403,
			erro: "Não é possível remover um usuário de nível superior",
		});
	});

	it("deve excluir usuário com sucesso", async () => {
		const usuario = {
			dados_administrativos: { funcao: "USUARIO" },
			deleteOne: jest.fn().mockResolvedValue(undefined),
		};
		const gerenciador = { dados_administrativos: { funcao: "ADMINISTRADOR" } };
		MockValidarID.mockReturnValue(true);
		MockUsuarioModel.findById
			.mockResolvedValueOnce(usuario)
			.mockResolvedValueOnce(gerenciador);

		const result = await UsuarioRepository.deleteUsuario("id", "gerenciadorId");

		expect(usuario.deleteOne).toHaveBeenCalled();
		expect(result.usuario).toEqual(usuario);
	});
});

describe("UsuarioRepository - Adicionar Token de Recuperação", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		MockUsuarioModel.mockImplementation(() => mockUsuarioInstance);
		mockUsuarioInstance.toObject.mockResolvedValue(undefined);
	});

	it("deve adicionar token de recuperação sem retornar erro", async () => {
		MockUsuarioModel.findByIdAndUpdate.mockResolvedValue(undefined);

		await UsuarioRepository.adicionarTokenRecuperacao("id", "token");

		expect(MockUsuarioModel.findByIdAndUpdate).toHaveBeenCalledWith("id", {
			token_recuperacao: "token",
		});
	});
});

describe("UsuarioRepository - Verificar Token", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		MockUsuarioModel.mockImplementation(() => mockUsuarioInstance);
		mockUsuarioInstance.toObject.mockResolvedValue(undefined);
	});

	it("deve verificar token de usuário pelo nome de usuário", async () => {
		MockUsuarioModel.findOne.mockResolvedValue({ nome_usuario: "user" });

		const result = await UsuarioRepository.verificarToken("user");

		expect(result).toEqual({ usuario: { nome_usuario: "user" } });
	});
});

describe("UsuarioRepository - Recuperar Senha", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		MockUsuarioModel.mockImplementation(() => mockUsuarioInstance);
		mockUsuarioInstance.toObject.mockResolvedValue(undefined);
	});

	it("deve retornar erro ao recuperar senha com token inválido", async () => {
		MockUsuarioModel.findById.mockResolvedValue({
			token_recuperacao: "wrong",
			updateOne: jest.fn(),
		});

		const result = await UsuarioRepository.recuperarSenha(
			"id",
			"token",
			"novaSenha",
		);

		expect(result.erros).toEqual({
			codigo: 400,
			erro: "Token de recuperação inválido",
		});
	});

	it("deve recuperar senha com sucesso quando token for válido", async () => {
		const usuario = {
			token_recuperacao: "token",
			updateOne: jest.fn().mockResolvedValue(undefined),
		};
		MockUsuarioModel.findById.mockResolvedValue(usuario);

		const result = await UsuarioRepository.recuperarSenha(
			"id",
			"token",
			"novaSenha",
		);

		expect(usuario.updateOne).toHaveBeenCalledWith({
			senha: "novaSenha",
			token_recuperacao: null,
		});
		expect(result.erros).toBeUndefined();
	});

	it("deve retornar erro quando recuperação de senha lança exceção", async () => {
		const usuario = {
			token_recuperacao: "token",
			updateOne: jest.fn().mockRejectedValue(new Error("Falha")),
		};
		MockUsuarioModel.findById.mockResolvedValue(usuario);
		MockErroParaDicionario.mockReturnValue({
			codigo: 500,
			erros: { mensagem: "Erro interno" },
		});

		const result = await UsuarioRepository.recuperarSenha(
			"id",
			"token",
			"novaSenha",
		);

		expect(result).toEqual({
			codigo: 500,
			erros: { codigo: 500, erro: { mensagem: "Erro interno" } },
		});
	});
});
