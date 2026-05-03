import recuperarSenhaService from "../../app/services/recuperar.senha.service";
import UsuarioRepository from "../../app/repositories/Usuario.repository";
import { verificarToken } from "../../app/utils/jwt";
import { criptografarSenha } from "../../app/utils/senhas";
import { validarSenha } from "../../app/utils/validators";

jest.mock("../../app/repositories/Usuario.repository");
jest.mock("../../app/utils/jwt");
jest.mock("../../app/utils/senhas");
jest.mock("../../app/utils/validators");

interface Payload {
	id: string;
	nome_usuario: string;
}

describe("recuperarSenhaService", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		(validarSenha as jest.Mock).mockReturnValue(true);
		(criptografarSenha as jest.Mock).mockResolvedValue("hashed_password");
	});

	it("deve recuperar senha com sucesso", async () => {
		const token = "recovery_token_123";
		const novaSenha = "novaSenha123";
		const usuarioMock = {
			_id: "507f1f77bcf86cd799439011",
			id: "507f1f77bcf86cd799439011",
			nome_usuario: "usuario_teste",
			email: "usuario@example.com",
		};

		const payloadMock: Payload = {
			id: usuarioMock._id,
			nome_usuario: usuarioMock.nome_usuario,
		};

		(verificarToken as jest.Mock).mockReturnValue(payloadMock);
		(UsuarioRepository.findUsuario as jest.Mock).mockResolvedValue(usuarioMock);
		(UsuarioRepository.recuperarSenha as jest.Mock).mockResolvedValue({
			erros: undefined,
		});

		await recuperarSenhaService(token, novaSenha);

		expect(verificarToken).toHaveBeenCalledWith(token);
		expect(validarSenha).toHaveBeenCalledWith(novaSenha);
		expect(criptografarSenha).toHaveBeenCalledWith(novaSenha);
		expect(UsuarioRepository.recuperarSenha).toHaveBeenCalledWith(
			usuarioMock.id,
			token,
			"hashed_password",
		);
	});

	it("deve lançar erro quando token não for fornecido", async () => {
		const novaSenha = "novaSenha123";

		await expect(recuperarSenhaService(undefined, novaSenha)).rejects.toEqual({
			codigo: 400,
			erro: "Token de recuperação inválido",
		});

		expect(UsuarioRepository.recuperarSenha).not.toHaveBeenCalled();
	});

	it("deve lançar erro quando token for inválido", async () => {
		const token = "invalid_token";
		const novaSenha = "novaSenha123";

		(verificarToken as jest.Mock).mockReturnValue(null);

		await expect(recuperarSenhaService(token, novaSenha)).rejects.toEqual({
			codigo: 400,
			erro: "Token de recuperação inválido",
		});

		expect(UsuarioRepository.recuperarSenha).not.toHaveBeenCalled();
	});

	it("deve lançar erro quando senha não for fornecida", async () => {
		const token = "recovery_token_456";

		const payloadMock: Payload = {
			id: "507f1f77bcf86cd799439012",
			nome_usuario: "usuario_teste",
		};

		(verificarToken as jest.Mock).mockReturnValue(payloadMock);

		await expect(recuperarSenhaService(token, undefined)).rejects.toEqual({
			codigo: 400,
			erro: "Senha é obrigatório",
		});

		expect(UsuarioRepository.recuperarSenha).not.toHaveBeenCalled();
	});

	it("deve lançar erro quando senha for inválida", async () => {
		const token = "recovery_token_789";
		const novaSenha = "123";

		const payloadMock: Payload = {
			id: "507f1f77bcf86cd799439013",
			nome_usuario: "usuario_teste",
		};

		(verificarToken as jest.Mock).mockReturnValue(payloadMock);
		(validarSenha as jest.Mock).mockReturnValue(false);

		await expect(recuperarSenhaService(token, novaSenha)).rejects.toEqual({
			codigo: 400,
			erro: "Senha inválida",
		});

		expect(criptografarSenha).not.toHaveBeenCalled();
		expect(UsuarioRepository.recuperarSenha).not.toHaveBeenCalled();
	});

	it("deve lançar erro quando usuário não for encontrado", async () => {
		const token = "recovery_token_101";
		const novaSenha = "novaSenha123";

		const payloadMock: Payload = {
			id: "507f1f77bcf86cd799439014",
			nome_usuario: "usuario_inexistente",
		};

		(verificarToken as jest.Mock).mockReturnValue(payloadMock);
		(UsuarioRepository.findUsuario as jest.Mock).mockResolvedValue(null);

		await expect(recuperarSenhaService(token, novaSenha)).rejects.toEqual({
			codigo: 400,
			erro: "Token inválido",
		});

		expect(UsuarioRepository.recuperarSenha).not.toHaveBeenCalled();
	});

	it("deve lançar erro quando repository retornar erro", async () => {
		const token = "recovery_token_202";
		const novaSenha = "novaSenha123";
		const usuarioMock = {
			_id: "507f1f77bcf86cd799439015",
			nome_usuario: "usuario_teste",
			email: "usuario@example.com",
		};

		const payloadMock: Payload = {
			id: usuarioMock._id,
			nome_usuario: usuarioMock.nome_usuario,
		};

		const erroMock = {
			codigo: 500,
			erro: "Erro ao atualizar senha",
		};

		(verificarToken as jest.Mock).mockReturnValue(payloadMock);
		(UsuarioRepository.findUsuario as jest.Mock).mockResolvedValue(usuarioMock);
		(UsuarioRepository.recuperarSenha as jest.Mock).mockResolvedValue({
			erros: erroMock,
		});

		await expect(recuperarSenhaService(token, novaSenha)).rejects.toEqual(erroMock);
	});

	it("deve criptografar senha antes de salvar", async () => {
		const token = "recovery_token_303";
		const novaSenha = "novaSenha456";
		const usuarioMock = {
			_id: "507f1f77bcf86cd799439016",
			id: "507f1f77bcf86cd799439016",
			nome_usuario: "usuario_teste",
			email: "usuario@example.com",
		};

		const payloadMock: Payload = {
			id: usuarioMock._id,
			nome_usuario: usuarioMock.nome_usuario,
		};

		const senhaCriptografada = "hashed_novaSenha456";

		(verificarToken as jest.Mock).mockReturnValue(payloadMock);
		(UsuarioRepository.findUsuario as jest.Mock).mockResolvedValue(usuarioMock);
		(criptografarSenha as jest.Mock).mockResolvedValue(senhaCriptografada);
		(UsuarioRepository.recuperarSenha as jest.Mock).mockResolvedValue({
			erros: undefined,
		});

		await recuperarSenhaService(token, novaSenha);

		expect(criptografarSenha).toHaveBeenCalledWith(novaSenha);
		expect(UsuarioRepository.recuperarSenha).toHaveBeenCalledWith(
			usuarioMock.id,
			token,
			senhaCriptografada,
		);
	});

	it("deve extrair payload correto do token", async () => {
		const token = "recovery_token_404";
		const novaSenha = "novaSenha789";
		const usuarioMock = {
			_id: "507f1f77bcf86cd799439017",
			nome_usuario: "usuario_teste",
			email: "usuario@example.com",
		};

		const payloadMock: Payload = {
			id: usuarioMock._id,
			nome_usuario: usuarioMock.nome_usuario,
		};

		(verificarToken as jest.Mock).mockReturnValue(payloadMock);
		(UsuarioRepository.findUsuario as jest.Mock).mockResolvedValue(usuarioMock);
		(UsuarioRepository.recuperarSenha as jest.Mock).mockResolvedValue({
			erros: undefined,
		});

		await recuperarSenhaService(token, novaSenha);

		expect(UsuarioRepository.findUsuario).toHaveBeenCalledWith({
			nome_usuario: payloadMock.nome_usuario,
		});
	});
});
