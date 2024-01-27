import { Paths } from "swagger-jsdoc";

const EntidadesPaths: Paths = {
	"/entidade/{id}": {
		get: {
			tags: ["Entidades"],
			summary: "Recupera uma entidade pelo seu ID",
			description: "Retorna uma única entidade do banco de dados pelo o ID informado.",
			parameters: [
				{
					name: "id",
					description: "ID da entidade cadastrada",
					in: "path",
					required: true,
				},
			],
			responses: {
				200: {
					description: "Recupera uma entidade cadastrada usando seu ID",
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/Entidade",
							},
						},
					},
				},
				400: {
					description: "Retornar erro ao informar um id inválido",
					content: {
						"text/html": {
							schema: {
								type: "string",
								example: "Id inválido",
							},
						},
					},
				},
				404: {
					description:
						"Retorna erro ao não encontrar entidade pelo ID informado",
					content: {
						"text/html": {
							type: "string",
							example: "Entidade não encontrada",
						},
					},
				},
			},
		},
		put: {
			tags: ["Entidades"],
			summary: "Atualiza uma entidade pelo seu ID",
			description: "Atualiza uma entidade pelo ID informado. É necessário estar autenticado e ser pelo menos gerente para realizar a ação.",
			parameters: [
				{
					name: "id",
					description:
						"ID da Entidade no banco de dados",
					in: "path",
					required: true,
				},
			],
			requestBody: {
				$ref: "#/components/requestBodies/Entidade",
			},
			responses: {
				200: {
					description: "Informa os dados atualizados da entidade",
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/Entidade",
							},
						},
					},
				},
				400: {
					description: "Retorna erro caso os dados informados sejam inválidos",
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/EntidadeBadRequest",
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
				500: {
					$ref: "#/components/responses/ErroInterno",
				},
			},
		},
		delete: {
			tags: ["Entidades"],
			summary: "Remove uma entidade pelo seu ID",
			description: "Remove uma entidade pelo ID informado. É necessário estar autenticado e ser pelo menos gerente para realizar a ação.",
			parameters: [
				{
					name: "id",
					description:
						"ID da entidade no banco de dados",
					in: "path",
					schema: {
						type: "string",
					},
				},
			],
			responses: {
				204: {
					description: "Confirma o sucesso em remover a entidade",
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
				500: {
					$ref: "#/components/responses/ErroInterno",
				},
			},
		},
	},

	"/entidade": {
		post: {
			tags: ["Entidades"],
			summary: "Cadastra uma entidade",
			description: "Cadastra uma entidade no banco de dados e retorna seus dados. É necessário estar autenticado e ser pelo menos gerente para realizar a ação.",
			requestBody: {
				$ref: "#/components/requestBodies/Entidade",
			},
			responses: {
				201: {
					description: "Cadastra uma entidade e a retorna",
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/Entidade",
							},
						},
					},
				},
				400: {
					description: "Retorna erros de validação dos dados",
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/EntidadeBadRequest",
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
				500: {
					$ref: "#/components/responses/ErroInterno",
				},
			},
		},
	},

	"/entidades": {
		get: {
			tags: ["Entidades"],
			summary: "Listagem das entidades cadastradas",
			description: "Retorna dados de paginação e uma lista com as entidades cadastradas.",
			parameters: [
				{
					name: "estado",
					description:
						"Estado salvo da entidade, deve ser informado exatamente da maneira que foi salvo",
					example: "Rondônia",
					in: "query",
					schema: {
						$type: "string",
					},
				},
				{
					name: "municipio",
					description:
						"Município salvo da entidade, deve ser informado exatamente da maneira que foi salvo",
					example: "Vilhena",
					in: "query",
					schema: {
						$type: "string",
					},
				},
				{
					name: "nome_entidade",
					description:
						"Nome da entidade, inteiro ou incompleto. O retorna é com base nas correspondências",
					example: "Ministério da saúde",
					in: "query",
					schema: {
						$type: "string",
					},
				},
				{
					name: "ativo",
					description:
						"Estado de ativação das entidades. Informe SIM para os ativos, NÃO para os inativos e TODOS para todos os estados",
					example: "TODOS",
					in: "query",
					schema: {
						$type: "string",
					},
				},
				{
					$ref: "#/components/parameters/Pagina",
				},
				{
					$ref: "#/components/parameters/Limite",
				},
			],
			responses: {
				200: {
					description:
						"Retorna um documento com os dados de listagem e o array de entidades correspondentes",
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/Entidades",
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
};

export default EntidadesPaths;
