import mongoose from "mongoose";
import Usuario from "../../app/models/Usuario";

const dadosUsuario = {
	_id: new mongoose.Types.ObjectId(),
	cpf: "23841067085",
	dados_administrativos: {
		entidade_relacionada: new mongoose.Types.ObjectId(),
		funcao: "ADMINISTRADOR",
	},
	email: "antoniobandeira@email.com",
	imagem_url: ".jpg",
	nome_completo: "Antonio Bandeira",
	nome_usuario: "antonio_bandeira",
	numero_registro: "0000000000",
	senha: "12345678Asdf",
};

describe("O modelo de usuário", () => {
	it("deve cadastrar um usuário com os dados informados", () => {
		const usuario = new Usuario(dadosUsuario);

		expect(usuario).toMatchObject(dadosUsuario);
	});

	it("deve realizar validação dos atributos obrigatórios", async () => {
		const usuario = new Usuario({});

		try {
			await usuario.validate();
		} catch (error: any) {
			const {
				cpf,
				"dados_administrativos.entidade_relacionada": dados_administrativos,
				email,
				nome_completo,
				nome_usuario,
				numero_registro,
				senha,
			} = error.errors;
			
			expect(cpf).toBeDefined()
			expect(dados_administrativos).toBeDefined()
			expect(email).toBeDefined()
			expect(nome_completo).toBeDefined()
			expect(nome_usuario).toBeDefined()
			expect(numero_registro).toBeDefined()
			expect(senha).toBeDefined()

			expect(cpf.message).toBe("CPF é obrigatório");
			expect(dados_administrativos.message).toBe(
				"Entidade relacionada é obrigatório"
			);
			expect(email.message).toBe("Email é obrigatório");
			expect(nome_completo.message).toBe("Nome completo é obrigatório");
			expect(nome_usuario.message).toBe("Nome de usuário é obrigatório");
			expect(numero_registro.message).toBe("Número de registro é obrigatório");
			expect(senha.message).toBe("Senha é obrigatória");
		}

		expect(usuario.validateSync).toThrow();
	});

	it("deve realizar validação dos atributos", async () => {
		const usuario = new Usuario({
			cpf: "12345678902",
			dados_administrativos: {
				entidade_relacionada: "Entidade falsa",
				funcao: "Presidente",
			},
			email: "antoniobandeira",
			nome_completo: "AB",
			nome_usuario: "Nome de usuário inválido",
			numero_registro: "Número inválido",
			senha: "123",
		});

		try {
			await usuario.validate();
		} catch (error: any) {
			const {
				cpf,
				"dados_administrativos.entidade_relacionada": entidade_relacionada,
				"dados_administrativos.funcao": funcao,
				email,
				nome_completo,
				nome_usuario,
				numero_registro,
				senha
			} = error.errors;

			expect(cpf).toBeDefined()
			expect(entidade_relacionada).toBeDefined()
			expect(funcao).toBeDefined()
			expect(email).toBeDefined()
			expect(nome_completo).toBeDefined()
			expect(nome_usuario).toBeDefined()
			expect(numero_registro).toBeDefined()
			expect(senha).toBeDefined()

			expect(cpf.message).toBe("CPF inválido")
			expect(entidade_relacionada.message).toBe("Entidade relacionada em dados administrativos inválida")
			expect(funcao.message).toBe("Função em dados administrativos inválida")
			expect(email.message).toBe("Email inválido")
			expect(nome_completo.message).toBe("Nome completo inválido")
			expect(nome_usuario.message).toBe("Nome de usuário inválido")
			expect(numero_registro.message).toBe("Número de registro inválido")
			expect(senha.message).toBe("Senha inválida")
		}
		expect(usuario.validateSync).toThrow();
	});
});
