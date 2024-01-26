import { Paths } from "swagger-jsdoc";

const UsuariosPaths: Paths = {
	"/usuario": {
		post: {
			tags: ["Usuários"],
			summary: "Cadastra um usuário",
			description:
				"Rota que realiza o cadastro de um usuário. O nível do usuário não pode ser maior do que aquele que está cadastrando.",
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
	"/usuarios": {},
	"/usuario/{id}": {},
};

export default UsuariosPaths;
