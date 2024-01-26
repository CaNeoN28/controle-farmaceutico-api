import { Parameter, Paths, Response } from "swagger-jsdoc";
import { Limite, Pagina } from "../components/parameters/Paginacao";

const ParametrosId: Parameter[] = [
	{
		name: "id",
		in: "path",
		required: true,
		description: "ID da farmácia",
	},
];

const FarmaciaNaoEncontrada: Response = {
	description: "Retorna erro ao não encontrar farmácia",
	content: {
		"text/html": {
			schema: {
				type: "string",
				example: "Farmácia não encontrada",
			},
		},
	},
};

const FarmaciasPaths: Paths = {
	"/farmacia": {
		post: {
			tags: ["Farmácias"],
			security: [{ BearerAuth: [] }],
			summary: "Cadastra uma farmácia",
			requestBody: {
				content: {
					"application/json": {
						schema: {
							$ref: "#/components/schemas/Farmacia",
						},
					},
				},
			},
			description:
				"Cadastra uma entidade no banco de dados e retorna seus dados. É necessário estar autenticado para usar esta rota.",
			responses: {
				201: {
					description: "Retorna os dados da farmácia cadastrada",
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/Farmacia",
							},
						},
					},
				},
				400: {
					descriptiom:
						"Retorna os erros de validação ao tentar cadastrar farmácia",
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/FarmaciaBadRequest",
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
	"/farmacia/{id}": {
		get: {
			tags: ["Farmácias"],
			summary: "Recupera uma farmácia pelo seu ID",
			description: "Recupera uma única farmácia do banco de dados pelo seu ID.",
			security: [],
			parameters: ParametrosId,
			responses: {
				200: {
					description: "Retorna os dados da farmácia",
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/Farmacia",
							},
						},
					},
				},
				400: {
					$ref: "#/components/responses/IDInvalido",
				},
				404: FarmaciaNaoEncontrada,
				500: {
					$ref: "#/components/responses/ErroInterno",
				},
			},
		},
		put: {
			tags: ["Farmácias"],
			summary: "Atualiza uma farmácia pelo seu ID",
			description:
				"Atualiza uma farmácia pelo ID informado e retorna os dados atualizados. É necessário estar autenticado",
			security: [{ BearerAuth: [] }],
			parameters: ParametrosId,
			requestBody: {
				content: {
					"application/json": {
						schema: {
							$ref: "#/components/schemas/Farmacia",
						},
					},
				},
			},
			responses: {
				200: {
					description: "Retorna os dados atualizados",
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/Farmacia",
							},
						},
					},
				},
				400: {
					description: "Retorna os erros de validação",
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/FarmaciaBadRequest",
							},
						},
					},
				},
				401: {
					$ref: "#/components/responses/ErroAutenticacao",
				},
				404: FarmaciaNaoEncontrada,
				500: {
					$ref: "#/components/responses/ErroInterno",
				},
			},
		},
		delete: {
			tags: ["Farmácias"],
			summary: "Remove uma farmácia",
			description:
				"Remove uma farmácia pelo ID informado. É necessário estar autenticado.",
			security: [{ BearerAuth: [] }],
			parameters: ParametrosId,
			responses: {
				204: {
					description: "Remove a farmácia",
				},
				400: {
					$ref: "#/components/responses/IDInvalido",
				},
				401: {
					$ref: "#/components/responses/ErroAutenticacao",
				},
				404: FarmaciaNaoEncontrada,
				500: {
					$ref: "#/components/responses/ErroInterno",
				},
			},
		},
	},
	"/farmacias": {
		get: {
			tags: ["Farmácias"],
			summary: "Listagem das farmácias cadastradas",
			description:
				"Retorna os dados de paginação e a lista das farmácias encontradas com base nos filtros informados.",
			security: [],
			parameters: [
				{
					name: "bairro",
					in: "query",
					description: "Bairro cadastrado no endereço da farmácia. Não precisa ser inteiro, dados incompletos retornam farmácias com dado semelhante.",
					schema: {
						type: "string"
					}
				}, {
					name: "estado",
					in: "query",
					description: "Estado cadastrado no endereço da farmácia. Não precisa ser inteiro, dados incompletos retornam farmácias com dado semelhante.",
					schema: {
						type: "string"
					}
				}, {
					name: "municipio",
					in: "query",
					description: "Município cadastrado no endereço da farmácia. Não precisa ser inteiro, dados incompletos retornam farmácias com dado semelhante.",
					schema: {
						type: "string"
					}
				},
				{
					name: "nome_fantasia",
					in: "query",
					description: "Nome fantasia da farmácia. Não precisa ser inteiro, dados incompletos retornam farmácias com dado semelhante.",
					schema: {
						type: "string"
					}
				},
				Pagina,
				Limite
			],
			responses: {
				200: {
					description: "Retorna os dados de paginação e as farmácias",
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/Farmacias",
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
	"/farmacia/proxima": {},
	"/farmacias/plantao": {},
};

export default FarmaciasPaths;
