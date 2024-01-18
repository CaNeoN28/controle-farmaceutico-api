import Ativo from "./Ativo";

interface IEntidade {
	nome_entidade: string;
	estado: string;
	municipio: string;
	ativo?: boolean;
}

interface FiltrosEntidade {
	nome_entidade?: RegExp | string;
	estado?: string;
	municipio?: string;
	ativo?: Ativo | boolean | {
		[key: string]: boolean[]
	}
}

class Entidade implements IEntidade {
	nome_entidade: string;
	estado: string;
	municipio: string;
	ativo?: boolean

	constructor({ estado, municipio, nome_entidade, ativo }: IEntidade) {
		this.estado = estado;
		this.municipio = municipio;
		this.nome_entidade = nome_entidade;
		this.ativo = ativo
	}
}

export default Entidade;
export { IEntidade, FiltrosEntidade };
