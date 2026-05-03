import updateUsuarioService from "../../app/services/update.usuario.service";
import UsuarioRepository from "../../app/repositories/Usuario.repository";
import { validarSenha } from "../../app/utils/validators";
import mongoose from "mongoose";

jest.mock("../../app/repositories/Usuario.repository");
jest.mock("../../app/utils/validators");
jest.mock("mongoose");

describe("updateUsuarioService", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		(validarSenha as jest.Mock).mockReturnValue(true);
		(mongoose.isValidObjectId as jest.Mock).mockReturnValue(true);
	});

	it("deve atualizar usuario com sucesso", async () => {
		const id = "507f1f77bcf86cd799439011";
		const idGerenciador = "507f1f77bcf86cd799439012";
		const dataAtualizar = {
			nome_completo: "Usuário Atualizado",
			email: "novo@example.com",
		};

		const usuarioMock = {
			_id: id,
			nome_completo: "Usuário Atualizado",
			email: "novo@example.com",
			nome_usuario: "usuario_teste",
			cpf: "12345678901",
			numero_registro: "CRF12345",
		};

		(UsuarioRepository.updateUsuario as jest.Mock).mockResolvedValue({
			usuario: usuarioMock,
			erros: undefined,
		});

		const result = await updateUsuarioService(id, dataAtualizar, idGerenciador);

		expect(result).toEqual(usuarioMock);
		expect(UsuarioRepository.updateUsuario).toHaveBeenCalledWith(
			id,
			dataAtualizar,
			idGerenciador,
		);
	});

	it("deve lançar erro quando tentar atualizar a si mesmo", async () => {
		const id = "507f1f77bcf86cd799439013";
		const dataAtualizar = {
			nome_completo: "Novo Nome",
		};

		await expect(updateUsuarioService(id, dataAtualizar, id)).rejects.toEqual({
			codigo: 403,
			erro: "Não é possível alterar seus próprios dados usando esta rota",
		});

		expect(UsuarioRepository.updateUsuario).not.toHaveBeenCalled();
	});

	it("deve lançar erro quando id for inválido", async () => {
		const id = "invalid_id";
		const idGerenciador = "507f1f77bcf86cd799439014";
		const dataAtualizar = {
			nome_completo: "Novo Nome",
		};

		(mongoose.isValidObjectId as jest.Mock).mockReturnValue(false);

		await expect(updateUsuarioService(id, dataAtualizar, idGerenciador)).rejects.toEqual(
			{
				codigo: 400,
				erro: "Id inválido",
			},
		);

		expect(UsuarioRepository.updateUsuario).not.toHaveBeenCalled();
	});

	it("deve lançar erro quando senha for inválida", async () => {
		const id = "507f1f77bcf86cd799439015";
		const idGerenciador = "507f1f77bcf86cd799439016";
		const dataAtualizar = {
			senha: "123",
		};

		(validarSenha as jest.Mock).mockReturnValue(false);

		await expect(updateUsuarioService(id, dataAtualizar, idGerenciador)).rejects.toEqual({
			codigo: 400,
			erro: {
				senha: "Senha inválida",
			},
		});

		expect(validarSenha).toHaveBeenCalledWith("123");
	});

	it("deve lançar erro quando repository retornar erro", async () => {
		const id = "507f1f77bcf86cd799439017";
		const idGerenciador = "507f1f77bcf86cd799439018";
		const dataAtualizar = {
			nome_completo: "Novo Nome",
		};

		const erroMock = {
			codigo: 409,
			erro: {
				nome_usuario: "Nome de usuário já existe",
			},
		};

		(UsuarioRepository.updateUsuario as jest.Mock).mockResolvedValue({
			usuario: null,
			erros: erroMock,
		});

		await expect(updateUsuarioService(id, dataAtualizar, idGerenciador)).rejects.toEqual(
			erroMock,
		);
	});

	it("deve combinar erros de senha e repository", async () => {
		const id = "507f1f77bcf86cd799439019";
		const idGerenciador = "507f1f77bcf86cd799439020";
		const dataAtualizar = {
			senha: "123",
			email: "novo@example.com",
		};

		const erroRepository = {
			codigo: 409,
			erro: {
				email: "Email já cadastrado",
			},
		};

		(validarSenha as jest.Mock).mockReturnValue(false);
		(UsuarioRepository.updateUsuario as jest.Mock).mockResolvedValue({
			usuario: null,
			erros: erroRepository,
		});

		await expect(updateUsuarioService(id, dataAtualizar, idGerenciador)).rejects.toEqual({
			codigo: 409,
			erro: {
				senha: "Senha inválida",
				email: "Email já cadastrado",
			},
		});
	});

	it("deve permitir atualizar sem alterar senha", async () => {
		const id = "507f1f77bcf86cd799439021";
		const idGerenciador = "507f1f77bcf86cd799439022";
		const dataAtualizar = {
			nome_completo: "Novo Nome",
			email: "novo@example.com",
		};

		const usuarioMock = {
			_id: id,
			...dataAtualizar,
			nome_usuario: "usuario_teste",
			cpf: "12345678901",
			numero_registro: "CRF12345",
		};

		(UsuarioRepository.updateUsuario as jest.Mock).mockResolvedValue({
			usuario: usuarioMock,
			erros: undefined,
		});

		const result = await updateUsuarioService(id, dataAtualizar, idGerenciador);

		expect(result).toEqual(usuarioMock);
		expect(validarSenha).not.toHaveBeenCalled();
	});

	it("deve validar objeto id antes de chamar repository", async () => {
		const id = "507f1f77bcf86cd799439023";
		const idGerenciador = "507f1f77bcf86cd799439024";
		const dataAtualizar = {
			nome_completo: "Novo Nome",
		};

		const usuarioMock = {
			_id: id,
			...dataAtualizar,
			nome_usuario: "usuario_teste",
			cpf: "12345678901",
			numero_registro: "CRF12345",
		};

		(UsuarioRepository.updateUsuario as jest.Mock).mockResolvedValue({
			usuario: usuarioMock,
			erros: undefined,
		});

		await updateUsuarioService(id, dataAtualizar, idGerenciador);

		expect(mongoose.isValidObjectId).toHaveBeenCalledWith(id);
	});
});
