import { Paths } from "swagger-jsdoc";

const AutenticacaoPaths: Paths = {
	"/cadastro": {
		post: {
			tags: ["Autenticação"],
			summary: "Cadastra um usuário como inativo",
			description:
				"Rota de auto-cadastro de usuário. Informe os dados e o usuário será cadastrado com seus dados administrativos inativos, sendo necessário a verificação de um gerente ou superior.",
			security: [],
			requestBody: {
				content: {
					"application/json": {
						schema: {
							type: "object",
							properties: {
								dados_administrativos: {
									type: "object",
									properties: {
										entidade_relacionada: {
											type: "string",
											required: true,
											obs: "Deve ser um ID válido do mongoose, referente a uma entidade",
										},
									},
								},
								cpf: {
									type: "string",
									required: true,
									obs: "Deve ser um CPF válido",
								},
								email: {
									type: "string",
									required: true,
									obs: "Deve ser um email válido",
								},
								imagem_url: {
									type: "string",
									obs: "Url da imagem de perfil do usuário",
								},
								nome_completo: {
									type: "string",
									required: true,
									obs: "Deve ter pelo menos 3 caractéres",
								},
								nome_usuario: {
									type: "string",
									required: true,
									obs: "Nome usado para entrar na plataforma.\n\nDeve ter pelo menos 3 caractéres.\n\nNão deve começar com acentos.",
								},
								numero_registro: {
									type: "string",
									required: true,
									obs: "Número de registro informado pela entidade",
								},
								senha: {
									type: "string",
									required: true,
									obs: "Senha do usuário. Deve haver pelo menos 8 caractéres, 1 número, 1 letra maiúscula, 1 letra minuscula e 1 caractére especial",
								},
							},
						},
					},
				},
			},
			responses: {
				201: {
					description: "Retorna os dados do usuário cadastro",
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/UsuarioGet",
							},
						},
					},
				},
				400: {
					description: "Retorna os erros de validação do cadastro",
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/UsuarioBadRequest",
							},
						},
					},
				},
				409: {
					description: "Erro ao informar um email ou senha já existentes",
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
	},
	"/login": {
		post: {
			tags: ["Autenticação"],
			summary: "Realiza login e retorna token de autenticação",
			description:
				"Recebe email e senha de usuário para realizar autenticação e retorna os dados do usuário e o token de autorização. O usuário não pode estar com os dados administrativos inativos.",
			security: [],
			requestBody: {
				content: {
					"application/json": {
						schema: {
							type: "object",
							properties: {
								nome_usuario: {
									type: "string",
								},
								senha: {
									type: "string",
								},
							},
						},
					},
				},
			},
			responses: {
				200: {
					description: "Retorna os dados de usuário e o token de autenticação",
					content: {
						"application/json": {
							schema: {
								type: "object",
								properties: {
									usuario: {
										$ref: "#/components/schemas/UsuarioGet",
									},
									token: {
										type: "string",
									},
								},
							},
						},
					},
				},
				401: {
					description: "Erro informado ao informar dados incorretos",
					content: {
						"text/html": {
							schema: {
								type: "string",
							},
						},
					},
				},
				403: {
					description:
						"Erro de não autorização, por conta do usuário inativo pelo token não poder ser gerado",
					content: {
						"text/html": {
							schema: {
								type: "string",
							},
						},
					},
				},
			},
		},
	},
	"/perfil": {
		get: {
			tags: ["Autenticação"],
			summary: "Retorna os dados do usuário autenticado",
			description:
				"Rota capaz de retornar os dados de somente um usuário, aquele que está autenticado. É necessário estar autenticado.",
			security: [{ BearerAuth: [] }],
			responses: {
				200: {
					description: "Retorna com sucesso os dados do usuário",
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/UsuarioGet",
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
	"/perfil/atualizar": {
		put: {
			tags: ["Autenticação"],
			summary: "Atualiza os dados do usuário autenticado",
			description:
				"Rota utilizada para atualização de alguns dados pelo próprio usuário autenticado. É necessário estar autenticado.",
			security: [{ BearerAuth: [] }],
			requestBody: {
				content: {
					"application/json": {
						schema: {
							type: "object",
							properties: {
								nome_usuario: {
									type: "string",
								},
								email: {
									type: "string",
								},
								senha: {
									type: "string",
								},
								imagem_url: {
									type: "string",
								},
							},
						},
					},
				},
			},
			responses: {
				200: {
					description: "Retorna os dados atualizados do usuário",
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/UsuarioGet",
							},
						},
					},
				},
				400: {
					description: "Retorna erro de validação dos dados de atualização",
					content: {
						"application/json": {
							schema: {
								type: "object",
								properties: {
									nome_usuario: {
										type: "string",
									},
									email: {
										type: "string",
									},
									senha: {
										type: "string",
									},
								},
							},
						},
					},
				},
				401: {
					$ref: "#/components/responses/ErroAutenticacao",
				},
				409: {
					description:
						"Retorna erro ao tentar alterar o email e nome de usuário para um já existente",
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
	},
	"/esqueceu-senha": {
		post: {
			tags: ["Autenticação"],
			summary: "Envia um email para recuperação",
			description:
				"Envia um email com token para recuperar senha. Não retorna erros se não encontrar o usuário, mas retorna erros se for um usuário inválido.",
			security: [],
			requestBody: {
				content: {
					"application/json": {
						schema: {
							type: "object",
							properties: {
								email: {
									type: "string",
									required: true,
								},
							},
						},
					},
				},
			},
			responses: {
				200: {
					description: "Envia ou não um email para o usuário",
					content: {
						"text/html": {
							schema: {
								type: "string",
								example: "Token de recuperação enviado",
							},
						},
					},
				},
				400: {
					description: "Retorna erro se o email for inválido",
					content: {
						"text/html": {
							schema: {
								type: "string",
								example: "Email é obrigatório",
							},
						},
					},
				},
				403: {
					description: "Retorna erro se o usuário for inativo",
					content: {
						"text/html": {
							schema: {
								type: "string",
								example: "O usuário ainda está inativo, espere sua ativação",
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
	"/verificar-token": {
		get: {
			tags: ["Autenticação"],
			summary: "Verifica o token de atualização de senha",
			description: "Valida o token e retorna erro se ele não for válido ou estiver expirado.",
			security: [],
			parameters: [
				{
					name: "token",
					in: "header",
					required: true,
					obs: "Token gerado pela rota /esqueceu-senha",
				},
			],
			responses: {
				201: {
					description: "Token é valido e pode ser usado",
				},
				401: {
					description: "Retorna erro de não autorização",
					content: {
						"text/html": {
							schema: {
								type: "string",
							},
						},
					},
				},
				500: {
					$ref: "#/components/responses/ErroInterno",
				},
			},
		}
	},
	"/recuperar-senha": {
		put: {
			tags: ["Autenticação"],
			summary: "Atualiza a senha pelo token",
			description: "Atualiza somente a senha se o token correto for informado.",
			security: [],
			parameters: [
				{
					name: "token",
					in: "header",
					required: true,
					obs: "Token gerado pela rota /esqueceu-senha",
				},
			],
			requestBody: {
				content: {
					"application/json": {
						schema: {
							type: "object",
							properties: {
								senha: {
									type: "string",
									required: true,
								},
							},
						},
					},
				},
			},
			responses: {
				200: {
					description: "Altera a senha com sucesso",
					content: {
						"text/html": {
							schema: {
								type: "string",
								example: "Senha alterada com sucesso",
							},
						},
					},
				},
				400: {
					description: "Retorna erros de validação",
					content: {
						"text/html": {
							schema: {
								type: "string",
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

export default AutenticacaoPaths;
