interface HorarioServico {
	dia_semana: string;
	horario_entrada: string;
	horario_saida: string;
}

interface IFarmacia {
	cnpj: string;
	nome_fantasia: string;
	imagem_url?: string;
	endereco: {
		cep: string;
		estado: string;
		municipio: string;
		bairro: string;
		logradouro: string;
		numero: string;
		localizacao: {
			x: string;
			y: string;
		};
	};
	horarios_servico?: HorarioServico[];
	plantoes?: string[];
}

class Farmacia implements IFarmacia {
	cnpj: string;
	nome_fantasia: string;
	endereco: {
		cep: string;
		estado: string;
		municipio: string;
		bairro: string;
		logradouro: string;
		numero: string;
		localizacao: { x: string; y: string };
	};
	horarios_servico?: HorarioServico[];
	plantoes?: string[];
	imagem_url?: string;

	constructor(data: IFarmacia) {
		this.cnpj = data.cnpj;
		this.nome_fantasia = data.nome_fantasia;
		this.endereco = data.endereco;
		this.horarios_servico = data.horarios_servico || [];
		this.plantoes = data.plantoes || [];
		this.imagem_url = data.imagem_url;
	}
}

export default Farmacia;
