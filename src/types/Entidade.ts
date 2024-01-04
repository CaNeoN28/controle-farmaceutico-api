interface IEntidade {
	nome_entidade: String;
	estado: String;
	municipio: String;
}

class Entidade implements IEntidade {
	nome_entidade: String;
	estado: String;
	municipio: String;

	constructor({ estado, municipio, nome_entidade }: IEntidade) {
		this.estado = estado;
		this.municipio = municipio;
		this.nome_entidade = nome_entidade;
	}
}

export default Entidade;
export { IEntidade };
