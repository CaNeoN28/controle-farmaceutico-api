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

const UsuarioSchema: Schema = {
	type: "object",
	properties: {
		...UsuarioGetSchema.properties,
		senha: {
			type: "string",
			required: true,
			obs: "Senha do usuário. Deve haver pelo menos 8 caractéres, 1 número, 1 letra maiúscula, 1 letra minuscula e 1 caractére especial",
		},
	},
};

const UsuarioBadRequest: Schema = {
	type: "object",
	properties: {
		cpf: {
			type: "string",
		},
		"dados_administrativos.entidade_relacionada": {
			type: "string",
		},
		"dados_administrativos.funcao": {
			type: "string",
		},
		email: {
			type: "string",
		},
		imagem_url: {
			type: "string",
		},
		nome_completo: {
			type: "string",
		},
		nome_usuario: {
			type: "string",
		},
		numero_registro: {
			type: "string",
		},
		senha: {
			type: "string",
		},
	},
};

const UsuarioConflict: Schema = {
	type: "object",
	properties: {
		email: {
			type: "string",
		},
		nome_usuario: {
			type: "string",
		},
	},
};

export { UsuarioGetSchema, UsuarioSchema, UsuarioBadRequest, UsuarioConflict };
