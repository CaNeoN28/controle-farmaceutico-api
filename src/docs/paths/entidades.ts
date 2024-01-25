import { Paths } from "swagger-jsdoc";

const EntidadesPaths: Paths = {
	"/entidade/{id}": {
		get: {
			description: "Recupera uma entidade",
			tags: ["Entidades"],
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
			description: "Atualiza uma entidade",
			tags: ["Entidades"],
			parameters: [
				{
					name: "id",
					description:
						"Atualiza a entidade informada pelo o ID. \n\n É necessário ser gerente ou superior para realizar a ação.",
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
			description: "Remove uma entidade",
			tags: ["Entidades"],
			parameters: [
				{
					name: "id",
					description:
						"Remove uma entidade informada pelo ID\n\nÉ necessário ser gerente ou superior para realizar a ação",
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
			description: "Cadastra uma entidade",
			tags: ["Entidades"],
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
};

export default EntidadesPaths;
