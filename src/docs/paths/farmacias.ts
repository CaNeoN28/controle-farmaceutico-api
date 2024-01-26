import { Parameter, Paths, Response } from "swagger-jsdoc";

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
	},
	"/farmacias": {},
	"/farmacia/proxima": {},
	"/farmacias/plantao": {},
};

export default FarmaciasPaths;
