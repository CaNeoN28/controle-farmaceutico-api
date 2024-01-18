interface IEntidade {
	nome_entidade: string;
	estado: string;
	municipio: string;
}

interface FiltrosEntidade {
	nome_entidade?: RegExp | string;
	estado?: string;
	municipio?: string;
}

class Entidade implements IEntidade {
	nome_entidade: string;
	estado: string;
	municipio: string;

	constructor({ estado, municipio, nome_entidade }: IEntidade) {
		this.estado = estado;
		this.municipio = municipio;
		this.nome_entidade = nome_entidade;
	}
}

export default Entidade;
export { IEntidade, FiltrosEntidade };
