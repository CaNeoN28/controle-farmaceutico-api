import { Paths } from "swagger-jsdoc";

const UsuariosPaths: Paths = {
	"/usuario": {
		post: {
			tags: ["Usuários"],
			summary: "Cadastra um usuário",
			description:
				"Rota que realiza o cadastro de um usuário. O nível do usuário não pode ser maior do que aquele que está cadastrando. É necessário estar autenticado e ser no mínimo gerente",
			requestBody: {
				content: {
					"application/json": {
						schema: {
							$ref: "#/components/schemas/Usuario",
						},
					},
				},
			},
			responses: {
				200: {
					description: "Retorna os dados do usuário cadastrado",
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/UsuarioGet",
							},
						},
					},
				},
				400: {
					description: "Retorna os erros de validação dos dados de usuário",
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/UsuarioBadRequest",
							},
						},
					},
				},
				401: {
					$ref: "#/components/responses/ErroAutenticacao",
				},
				403: {
					$ref: "#/components/responses/ErroNaoGerente",
				},
				409: {
					description:
						"Erro ao tentar cadastrar um usuário com email e nome de usuário já utilizados",
					content: {
						"application/json": {
							schema: {
								type: "object",
								properties: {
									email: {
										type: "string",
									},
									nome_usuario: {
										type: "string",
									},
								},
							},
						},
					},
				},
				500: {
					$ref: "#/components/responses/ErroInterno",
				},
			},
		},
	},
	"/usuarios": {
		get: {
			tags: ["Usuários"],
			summary: "Listagem de usuários cadastrados",
			description:
				"Retorna dados de paginação e uma lista dos usuários cadastrados filtrados pelos parâmetros informados. É necessário estar autenticado.",
			parameters: [
				{
					name: "cpf",
					in: "query",
					description:
						"CPF do usuário cadastrado. Funciona por meio de semelhança, informar apenas uma parte retorna todos os parecidos",
					schema: {
						type: "string",
					},
				},
				{
					name: "entidade_relacionada",
					in: "query",
					description: "ID da entidade relacionada ao usuário",
					schema: {
						type: "string",
					},
				},
				{
					name: "funcao",
					in: "query",
					description: "Função ou nível do usuário",
					schema: {
						type: "string",
						enum: ["INATIVO", "USUARIO", "GERENTE", "ADMINISTRADOR"],
					},
				},
				{
					name: "nome_usuario",
					in: "query",
					description:
						"Nome de usuário cadastrado, funciona por meio de semelhança",
					schema: {
						type: "string",
					},
				},
			],
			responses: {
				200: {
					description:
						"Retorno dos dados de paginação e da lista de usuários correspondentes",
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/Usuarios",
							},
						},
					},
				},
				401: {
					$ref: "#/components/responses/ErroAutenticacao",
				},
				500: {
					$ref: "#/components/responses/ErroInterno",
				},
			},
		},
	},
	"/usuario/{id}": {},
};

export default UsuariosPaths;
