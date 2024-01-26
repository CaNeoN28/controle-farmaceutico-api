import { Paths } from "swagger-jsdoc";

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
		parameters: {
			name: "id",
			in: "path",
			required: true,
			description: "ID da farmácia",
		},
	},
	"/farmacias": {},
	"/farmacia/proxima": {},
	"/farmacias/plantao": {},
};

export default FarmaciasPaths;
