import { Components } from "swagger-jsdoc";
import {} from "./schemas/Autenticacao";
import {
	EntidadeBadRequest,
	EntidadeSchema,
	EntidadesSchema,
} from "./schemas/Entidade";
import {} from "./schemas/Farmacia";
import {
	UsuarioBadRequest,
	UsuarioConflict,
	UsuarioGetSchema,
	UsuarioSchema,
} from "./schemas/Usuario";
import { BearerAuth } from "./securitySchemes/BearerAuth";
import { Limite, Pagina } from "./parameters/Paginacao";
import {
	ErroAutenticacao,
	ErroInterno,
	ErroNaoGerente,
	IDInvalido,
} from "./responses/Erros";
import EnvioEntidade from "./requestBodies/EnvioEntidade";

const components: Components = {
	schemas: {
		Entidade: EntidadeSchema,
		Entidades: EntidadesSchema,
		EntidadeBadRequest: EntidadeBadRequest,
		UsuarioGet: UsuarioGetSchema,
		UsuarioBadRequest: UsuarioBadRequest,
		UsuarioConflict: UsuarioConflict,
		Usuario: UsuarioSchema,
	},
	parameters: {
		Limite,
		Pagina,
	},
	requestBodies: {
		Entidade: EnvioEntidade,
	},
	responses: {
		ErroAutenticacao,
		ErroNaoGerente,
		ErroInterno,
		IDInvalido,
	},
	securitySchemes: {
		BearerAuth,
	},
};

export default components;
