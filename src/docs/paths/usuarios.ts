import { Paths, Parameter, Response } from "swagger-jsdoc";

const ParametrosId: Parameter[] = [
	{
		name: "id",
		in: "path",
		required: true,
		description: "ID do usuário cadastrado",
		schema: {
			type: "string",
		},
	},
];

const NotFound: Response = {
	description: "Retorna erro se não for possível encontrar usuário",
	content: {
		"text/html": {
			schema: {
				type: "string",
				example: "Usuário não encontrado",
			},
		},
	},
};

const UsuariosPaths: Paths = {
	"/usuario": {
		post: {
			tags: ["Usuários"],
			summary: "Cadastra um usuário",
			description:
				"Rota que realiza o cadastro de um usuário. O nível do usuário não pode ser maior do que aquele que está cadastrando. É necessário estar autenticado e ser no mínimo gerente",
			security: [{ BearerAuth: [] }],
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
			security: [{ BearerAuth: [] }],
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
	"/usuario/{id}": {
		get: {
			tags: ["Usuários"],
			summary: "Recupera um usuário pelo seu ID",
			description:
				"Retorna um usuário por meio do ID informado. É necessário estar autenticado.",
			security: [{ BearerAuth: [] }],
			parameters: ParametrosId,
			responses: {
				200: {
					description: "Retorna os dados do usuário informado",
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/UsuarioGet",
							},
						},
					},
				},
				400: {
					$ref: "#/components/responses/IDInvalido",
				},
				401: {
					$ref: "#/components/responses/ErroAutenticacao",
				},
				404: NotFound,
				500: {
					$ref: "#/components/responses/ErroInterno",
				},
			},
		},
		put: {
			tags: ["Usuários"],
			summary: "Atualiza um usuário pelo seu ID",
			description:
				"Atualiza um usuário pelo ID informado. É necessário estar autenticado se ser gerente ou superior. Não é possível aumentar o nível do usuário para ser superior aquele que está atualizando. Não é possível alterar os dados de um usuário de nível superior",
			security: [{ BearerAuth: [] }],
			parameters: ParametrosId,
			responses: {
				200: {
					description: "Retorna os dados atualizados de um dado",
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/UsuarioGet",
							},
						},
					},
				},
				400: {
					description: "Retorna os erros de validação do usuário",
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
				404: {},
				409: {
					description:
						"Retorna erro ao tentar alterar email e nome de usuário para um já existente",
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/UsuarioConflict",
							},
						},
					},
				},
				500: {
					$ref: "#/components/responses/ErroInterno",
				},
			},
		},
		delete: {
			tags: ["Usuários"],
			summary: "Remove um usuário pelo seu ID",
			description:
				"Remove um usuário pelo seu ID. É necessário estar autenticado, ser um gerente ou superior, e ser pelo menos do nível do usuário.",
			security: [{ BearerAuth: [] }],
			parameters: ParametrosId,
			responses: {
				204: {
					description: "Remove o usuário",
				},
				400: {
					$ref: "#/components/responses/IDInvalido",
				},
				401: {
					$ref: "#/components/responses/ErroAutenticacao",
				},
				403: {
					$ref: "#/components/responses/ErroNaoGerente",
				},
				404: NotFound,
				500: {
					$ref: "#/components/responses/ErroInterno",
				},
			},
		},
	},
};

export default UsuariosPaths;
