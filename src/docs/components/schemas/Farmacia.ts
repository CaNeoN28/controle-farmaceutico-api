import { Schema } from "swagger-jsdoc";

const Endereco: Schema = {
	type: "object",
	required: true,
	properties: {
		cep: {
			type: "string",
			required: true,
			obs: "Deve ser um cep com 8 dígitos",
		},
		estado: {
			type: "string",
			required: true,
			obs: "Deve ser um estado válido do Brasil",
		},
		municipio: {
			type: "string",
			required: true,
			obs: "Deve ser um município do Brasil e deve pertencer ao estado cadastrado",
		},
		bairro: {
			type: "string",
			required: true,
			obs: "Deve possuir pelo menos 3 caractéres",
		},
		logradouro: {
			type: "string",
			required: true,
			obs: "Deve possuir pelo menos 3 carectéres",
		},
		numero: {
			type: "string",
			required: true,
			obs: "Deve ser numérico",
		},
		localizacao: {
			type: "object",
			required: true,
			properties: {
				x: {
					type: "number",
					required: true,
					obs: "Latitude. Deve ser um número entre -90 e 90",
				},
				y: {
					type: "number",
					required: true,
					obs: "Longitude. Deve ser um número entre -180 e 180",
				},
			},
		},
	},
};

const HorarioServico: Schema = {
	type: "object",
	properties: {
		horario_entrada: {
			type: "string",
			required: true,
			obs: "Horário de começo de serviço. Deve ser menor que o de saída",
		},
		horario_saida: {
			type: "string",
			required: true,
			obs: "Horário de saída de serviço. Deve ser maior que o de entrada",
		},
	},
};

const HorariosServico: Schema = {
	type: "object",
	required: true,
	properties: {
		segunda_feira: HorarioServico,
		terca_feira: HorarioServico,
		quarta_feira: HorarioServico,
		quinta_feira: HorarioServico,
		sexta_feira: HorarioServico,
		sabado: HorarioServico,
		domingo: HorarioServico,
	},
};

const FarmaciaSchema: Schema = {
	type: "object",
	properties: {
		cnpj: {
			type: "string",
			required: true,
			obs: "Deve possuir 14 dígitos e ser um cnpj válido",
		},
		nome_fantasia: {
			type: "string",
			required: true,
			obs: "Deve possuir pelo menos 3 caractéres",
		},
		endereco: Endereco,
		plantoes: {
			type: "array",
			items: {
				type: "string",
				obs: "Deve ser uma data válida",
			},
		},
		horarios_servico: HorariosServico,
		imagem_url: {
			type: "string",
			obs: "Url da imagem da farmácia",
		},
	},
};

const FarmaciasSchema: Schema = {
	type: "object",
	properties: {
		dados: {
			type: "array",
			items: {
				$ref: "#/components/schemas/Farmacia",
			},
		},
		pagina: {
			type: "number",
		},
		paginas_totais: {
			type: "number",
		},
		limite: {
			type: "number",
		},
		documentos_totais: {
			type: "number",
		},
	},
}

const FarmaciaBadRequest: Schema = {
	type: "object",
	properties: {
		cnpj: {
			type: "string",
		},
		nome_fantasia: {
			type: "string",
		},
		"endereco.cep": {
			type: "string",
		},
		"endereco.estado": {
			type: "string",
		},
		"endereco.municipio": {
			type: "string",
		},
		"endereco.bairro": {
			type: "string",
		},
		"endereco.logradouro": {
			type: "string",
		},
		"endereco.numero": {
			type: "string",
		},
		"endereco.localizacao.x": {
			type: "string",
		},
		"endereco.localizacao.y": {
			type: "string",
		},
		plantoes: {
			type: "string",
		},
		"horarios_servico.segunda_feira.horario_entrada": {
			type: "string",
		},
		"horarios_servico.segunda_feira.horario_saida": {
			type: "string",
		},
		"horarios_servico.terca.horario_entrada": {
			type: "string",
		},
		"horarios_servico.terca.horario_saida": {
			type: "string",
		},
		"horarios_servico.quarta.horario_entrada": {
			type: "string",
		},
		"horarios_servico.quarta.horario_saida": {
			type: "string",
		},
		"horarios_servico.quinta.horario_entrada": {
			type: "string",
		},
		"horarios_servico.quinta.horario_saida": {
			type: "string",
		},
		"horarios_servico.sexta.horario_entrada": {
			type: "string",
		},
		"horarios_servico.sexta.horario_saida": {
			type: "string",
		},
		"horarios_servico.sabado.horario_entrada": {
			type: "string",
		},
		"horarios_servico.sabado.horario_saida": {
			type: "string",
		},
		"horarios_servico.domingo.horario_entrada": {
			type: "string",
		},
		"horarios_servico.domingo.horario_saida": {
			type: "string",
		},
	},
};

export { FarmaciaSchema, FarmaciasSchema, FarmaciaBadRequest };
