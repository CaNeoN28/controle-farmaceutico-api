import { Schema } from "swagger-jsdoc";

const UsuarioGetSchema: Schema = {
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
				funcao: {
					type: "string",
					required: true,
					obs: "Nível de privilégio do usuário, pode ser INATIVO, USUARIO, GERENTE e ADMINISTRADOR",
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
	},
};

export { UsuarioGetSchema };
