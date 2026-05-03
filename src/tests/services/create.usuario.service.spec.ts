import createUsuarioService from "../../app/services/create.usuario.service";
import UsuarioRepository from "../../app/repositories/Usuario.repository";
import { validarSenha } from "../../app/utils/validators";
import { criptografarSenha } from "../../app/utils/senhas";
import { Types } from "mongoose";
import Usuario from "../../types/Usuario";

jest.mock("../../app/repositories/Usuario.repository");
jest.mock("../../app/utils/validators");
jest.mock("../../app/utils/senhas");

describe("createUsuarioService", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		(validarSenha as jest.Mock).mockReturnValue(true);
		(criptografarSenha as jest.Mock).mockResolvedValue("senha_criptografada");
	});

	it("deve criar usuario com sucesso", async () => {
		const usuarioData = {
			nome_completo: "João Silva",
			email: "joao@example.com",
			nome_usuario: "joao_silva",
			cpf: "12345678901",
			numero_registro: "CRF12345",
			senha: "senha123",
			dados_administrativos: {
				funcao: "GERENTE" as const,
				entidade_relacionada: new Types.ObjectId("507f1f77bcf86cd799439011"),
			},
		};

		const usuarioMock = {
			...usuarioData,
			_id: "123",
			senha: "senha_criptografada",
		};

		const usuarioRetornoMock = {
			...usuarioMock,
			senha: undefined,
			token_recuperacao: undefined,
		};

		(UsuarioRepository.createUsuario as jest.Mock).mockResolvedValue({
			usuario: usuarioMock,
			erro: undefined,
		});

		const result = await createUsuarioService(usuarioData);

		expect(result).toEqual(usuarioRetornoMock);
		expect(validarSenha).toHaveBeenCalledWith("senha123");
		expect(criptografarSenha).toHaveBeenCalledWith("senha123");
		expect(UsuarioRepository.createUsuario).toHaveBeenCalledWith({
			...usuarioData,
			senha: "senha_criptografada",
		}, undefined);
	});

	it("deve criar usuario com criadorId", async () => {
		const usuarioData = {
			nome_completo: "Maria Santos",
			email: "maria@example.com",
			nome_usuario: "maria_santos",
			cpf: "98765432100",
			numero_registro: "CRF67890",
			senha: "senha456",
			dados_administrativos: {
				funcao: "USUARIO" as const,
				entidade_relacionada: new Types.ObjectId("507f1f77bcf86cd799439012"),
			},
		};

		const criadorId = "507f1f77bcf86cd799439013";

		const usuarioMock = {
			...usuarioData,
			_id: "124",
			senha: "senha_criptografada",
		};

		const usuarioRetornoMock = {
			...usuarioMock,
			senha: undefined,
			token_recuperacao: undefined,
		};

		(UsuarioRepository.createUsuario as jest.Mock).mockResolvedValue({
			usuario: usuarioMock,
			erro: undefined,
		});

		const result = await createUsuarioService(usuarioData, criadorId);

		expect(result).toEqual(usuarioRetornoMock);
		expect(UsuarioRepository.createUsuario).toHaveBeenCalledWith({
			...usuarioData,
			senha: "senha_criptografada",
		}, criadorId);
	});

	it("deve lançar erro quando senha for inválida", async () => {
		const usuarioData = {
			nome_completo: "Pedro Oliveira",
			email: "pedro@example.com",
			nome_usuario: "pedro_oliveira",
			cpf: "11122233344",
			numero_registro: "CRF11111",
			senha: "123", // senha inválida
			dados_administrativos: {
				funcao: "USUARIO" as const,
				entidade_relacionada: new Types.ObjectId("507f1f77bcf86cd799439014"),
			},
		};

		(validarSenha as jest.Mock).mockReturnValue(false);

		await expect(createUsuarioService(usuarioData)).rejects.toEqual({
			codigo: 400,
			erro: {
				senha: "Senha inválida",
			},
		});

		expect(validarSenha).toHaveBeenCalledWith("123");
		expect(UsuarioRepository.createUsuario).toHaveBeenCalled();
	});

	it("deve lançar erro quando repository retornar erro", async () => {
		const usuarioData = {
			nome_completo: "Ana Costa",
			email: "ana@example.com",
			nome_usuario: "ana_costa",
			cpf: "55566677788",
			numero_registro: "CRF22222",
			senha: "senha789",
			dados_administrativos: {
				funcao: "GERENTE" as const,
				entidade_relacionada: new Types.ObjectId("507f1f77bcf86cd799439015"),
			},
		};

		const erroMock = {
			codigo: 409,
			erro: {
				nome_usuario: "Nome de usuário já existe",
			},
		};

		(UsuarioRepository.createUsuario as jest.Mock).mockResolvedValue({
			usuario: null,
			erro: erroMock,
		});

		await expect(createUsuarioService(usuarioData)).rejects.toEqual({
			codigo: 409,
			erro: {
				nome_usuario: "Nome de usuário já existe",
			},
		});
	});

	it("deve combinar erros de senha inválida e repository", async () => {
		const usuarioData = {
			nome_completo: "Carlos Lima",
			email: "carlos@example.com",
			nome_usuario: "carlos_lima",
			cpf: "99988877766",
			numero_registro: "CRF33333",
			senha: "123", // senha inválida
			dados_administrativos: {
				funcao: "USUARIO" as const,
				entidade_relacionada: new Types.ObjectId("507f1f77bcf86cd799439016"),
			},
		};

		const erroMock = {
			codigo: 409,
			erro: {
				email: "Email já cadastrado",
			},
		};

		(validarSenha as jest.Mock).mockReturnValue(false);
		(UsuarioRepository.createUsuario as jest.Mock).mockResolvedValue({
			usuario: null,
			erro: erroMock,
		});

		await expect(createUsuarioService(usuarioData)).rejects.toEqual({
			codigo: 409,
			erro: {
				senha: "Senha inválida",
				email: "Email já cadastrado",
			},
		});
	});

	it("deve aceitar usuario sem senha", async () => {
		const usuarioData = {
			nome_completo: "Roberto Silva",
			email: "roberto@example.com",
			nome_usuario: "roberto_silva",
			cpf: "44455566677",
			numero_registro: "CRF44444",
			dados_administrativos: {
				funcao: "GERENTE" as const,
				entidade_relacionada: new Types.ObjectId("507f1f77bcf86cd799439017"),
			},
		} as Usuario;

		const usuarioMock = {
			...usuarioData,
			_id: "125",
		};

		const usuarioRetornoMock = {
			...usuarioMock,
			senha: undefined,
			token_recuperacao: undefined,
		};

		(UsuarioRepository.createUsuario as jest.Mock).mockResolvedValue({
			usuario: usuarioMock,
			erro: undefined,
		});

		const result = await createUsuarioService(usuarioData);

		expect(result).toEqual(usuarioRetornoMock);
		expect(validarSenha).not.toHaveBeenCalled();
		expect(criptografarSenha).not.toHaveBeenCalled();
		expect(UsuarioRepository.createUsuario).toHaveBeenCalledWith(usuarioData, undefined);
	});
});