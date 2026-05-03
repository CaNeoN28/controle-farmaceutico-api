import listUsuariosService from "../../app/services/list.usuario.service";
import UsuarioRepository from "../../app/repositories/Usuario.repository";
import * as paginacaoUtils from "../../app/utils/paginacao";

jest.mock("../../app/repositories/Usuario.repository");
jest.mock("../../app/utils/paginacao");

describe("listUsuariosService", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("deve listar usuarios com todos os filtros", async () => {
		const params = {
			cpf: "123.456.789-00",
			nome_usuario: "usuario",
			entidade_relacionada: "507f1f77bcf86cd799439011",
			funcao: "GERENTE",
			pagina: 1,
			limite: 10,
		};

		const idLogado = "507f1f77bcf86cd799439012";

		const usuariosMock = [
			{
				_id: "507f1f77bcf86cd799439011",
				nome_usuario: "usuario_teste",
				cpf: "123.456.789-00",
				email: "usuario@example.com",
				dados_administrativos: {
					funcao: "GERENTE",
					entidade_relacionada: "507f1f77bcf86cd799439010",
				},
			},
		];

		const responsaMock = {
			dados: usuariosMock,
			documentos_totais: 1,
			limite: 10,
			pagina: 1,
			paginas_totais: 1,
		};

		(paginacaoUtils.extrairPaginacao as jest.Mock).mockReturnValue({
			limite: 10,
			pagina: 1,
		});

		(UsuarioRepository.findUsuarios as jest.Mock).mockResolvedValue(
			responsaMock,
		);

		const result = await listUsuariosService(params, idLogado);

		expect(result).toEqual(responsaMock);
		expect(UsuarioRepository.findUsuarios).toHaveBeenCalledWith(
			expect.any(Object),
			expect.any(Object),
			idLogado,
		);
	});

	it("deve filtrar por cpf com RegExp", async () => {
		const params = {
			cpf: "123",
			pagina: 1,
			limite: 10,
		};

		const idLogado = "507f1f77bcf86cd799439012";

		const responsaMock = {
			dados: [],
			documentos_totais: 0,
			limite: 10,
			pagina: 1,
			paginas_totais: 0,
		};

		(paginacaoUtils.extrairPaginacao as jest.Mock).mockReturnValue({
			limite: 10,
			pagina: 1,
		});

		(UsuarioRepository.findUsuarios as jest.Mock).mockResolvedValue(
			responsaMock,
		);

		await listUsuariosService(params, idLogado);

		const callArgs = (UsuarioRepository.findUsuarios as jest.Mock).mock
			.calls[0][0];
		expect(callArgs.cpf).toBeInstanceOf(RegExp);
	});

	it("deve filtrar por nome_usuario com RegExp", async () => {
		const params = {
			nome_usuario: "usuario",
			pagina: 1,
			limite: 10,
		};

		const idLogado = "507f1f77bcf86cd799439012";

		const responsaMock = {
			dados: [],
			documentos_totais: 0,
			limite: 10,
			pagina: 1,
			paginas_totais: 0,
		};

		(paginacaoUtils.extrairPaginacao as jest.Mock).mockReturnValue({
			limite: 10,
			pagina: 1,
		});

		(UsuarioRepository.findUsuarios as jest.Mock).mockResolvedValue(
			responsaMock,
		);

		await listUsuariosService(params, idLogado);

		const callArgs = (UsuarioRepository.findUsuarios as jest.Mock).mock
			.calls[0][0];
		expect(callArgs.nome_usuario).toBeInstanceOf(RegExp);
	});

	it("deve filtrar por entidade_relacionada", async () => {
		const params = {
			entidade_relacionada: "507f1f77bcf86cd799439011",
			pagina: 1,
			limite: 10,
		};

		const idLogado = "507f1f77bcf86cd799439012";

		const responsaMock = {
			dados: [],
			documentos_totais: 0,
			limite: 10,
			pagina: 1,
			paginas_totais: 0,
		};

		(paginacaoUtils.extrairPaginacao as jest.Mock).mockReturnValue({
			limite: 10,
			pagina: 1,
		});

		(UsuarioRepository.findUsuarios as jest.Mock).mockResolvedValue(
			responsaMock,
		);

		await listUsuariosService(params, idLogado);

		const callArgs = (UsuarioRepository.findUsuarios as jest.Mock).mock
			.calls[0][0];
		expect(callArgs["dados_administrativos.entidade_relacionada"]).toBe(
			"507f1f77bcf86cd799439011",
		);
	});

	it("deve filtrar por funcao", async () => {
		const params = {
			funcao: "ADMINISTRADOR",
			pagina: 1,
			limite: 10,
		};

		const idLogado = "507f1f77bcf86cd799439012";

		const responsaMock = {
			dados: [],
			documentos_totais: 0,
			limite: 10,
			pagina: 1,
			paginas_totais: 0,
		};

		(paginacaoUtils.extrairPaginacao as jest.Mock).mockReturnValue({
			limite: 10,
			pagina: 1,
		});

		(UsuarioRepository.findUsuarios as jest.Mock).mockResolvedValue(
			responsaMock,
		);

		await listUsuariosService(params, idLogado);

		const callArgs = (UsuarioRepository.findUsuarios as jest.Mock).mock
			.calls[0][0];
		expect(callArgs["dados_administrativos.funcao"]).toBe("ADMINISTRADOR");
	});

	it("deve passar idLogado para o repository", async () => {
		const params = {
			pagina: 1,
			limite: 10,
		};

		const idLogado = "507f1f77bcf86cd799439012";

		const responsaMock = {
			dados: [],
			documentos_totais: 0,
			limite: 10,
			pagina: 1,
			paginas_totais: 0,
		};

		(paginacaoUtils.extrairPaginacao as jest.Mock).mockReturnValue({
			limite: 10,
			pagina: 1,
		});

		(UsuarioRepository.findUsuarios as jest.Mock).mockResolvedValue(
			responsaMock,
		);

		await listUsuariosService(params, idLogado);

		expect(UsuarioRepository.findUsuarios).toHaveBeenCalledWith(
			expect.any(Object),
			expect.any(Object),
			idLogado,
		);
	});

	it("deve usar valores de paginação padrão", async () => {
		const params = {};

		const idLogado = "507f1f77bcf86cd799439012";

		const responsaMock = {
			dados: [],
			documentos_totais: 0,
			limite: 10,
			pagina: 1,
			paginas_totais: 0,
		};

		(paginacaoUtils.extrairPaginacao as jest.Mock).mockReturnValue({
			limite: undefined,
			pagina: undefined,
		});

		(UsuarioRepository.findUsuarios as jest.Mock).mockResolvedValue(
			responsaMock,
		);

		const result = await listUsuariosService(params, idLogado);

		expect(result).toEqual(responsaMock);
	});

	it("deve retornar lista vazia quando nenhum usuario corresponder", async () => {
		const params = {
			nome_usuario: "nao_existe",
			pagina: 1,
			limite: 10,
		};

		const idLogado = "507f1f77bcf86cd799439012";

		const responsaMock = {
			dados: [],
			documentos_totais: 0,
			limite: 10,
			pagina: 1,
			paginas_totais: 0,
		};

		(paginacaoUtils.extrairPaginacao as jest.Mock).mockReturnValue({
			limite: 10,
			pagina: 1,
		});

		(UsuarioRepository.findUsuarios as jest.Mock).mockResolvedValue(
			responsaMock,
		);

		const result = await listUsuariosService(params, idLogado);

		expect(result.dados).toEqual([]);
		expect(result.documentos_totais).toBe(0);
	});

	it("deve propagar erro do repository", async () => {
		const params = {
			cpf: "123.456.789-00",
			pagina: 1,
			limite: 10,
		};

		const idLogado = "507f1f77bcf86cd799439012";

		const erroMock = {
			codigo: 500,
			erro: "Erro ao conectar com o banco de dados",
		};

		(paginacaoUtils.extrairPaginacao as jest.Mock).mockReturnValue({
			limite: 10,
			pagina: 1,
		});

		(UsuarioRepository.findUsuarios as jest.Mock).mockRejectedValue(
			erroMock,
		);

		await expect(listUsuariosService(params, idLogado)).rejects.toEqual(
			erroMock,
		);
	});
});
