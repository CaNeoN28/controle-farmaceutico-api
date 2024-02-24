import FarmaciaModel from "../app/models/Farmacia";
import faker from "faker-br";
import getEstadoEMunicipio from "../app/utils/getEstadoEMunicipio";

export default async function farmaciasSeed(instancias: number) {
	await FarmaciaModel.deleteMany();

	const farmaciasId = [];

	for (let i = 0; i < instancias; i++) {
		const { estado, municipio } = getEstadoEMunicipio();

		const getHorario = () => {
			return {
				horario_entrada: "07:00",
				horario_saida: "17:00",
			};
		};

		const plantoes: { entrada: Date; saida: Date }[] = [];

		for (let j = 0; j < 5; j++) {
			const entrada = faker.date.future();
			entrada.setHours(7, 0)
			const saida = new Date(Number(entrada) + 24 * 60 * 60 * 1000);

			plantoes.push({
				entrada,
				saida
			});
		}

		const Farmacia = new FarmaciaModel({
			cnpj: faker.br.cnpj(),
			endereco: {
				bairro: faker.address.streetName(),
				cep: Math.floor(Math.random() * 10000000 + 10000000),
				estado: "Rondônia",
				localizacao: {
					x: -12 - Math.random(),
					y: -60 - Math.random(),
				},
				logradouro: faker.address.streetName(),
				municipio: "Vilhena",
				numero: Math.floor(Math.random() * 10000),
			},
			horarios_servico: {
				segunda_feira: getHorario(),
				terca_feira: getHorario(),
				quarta_feira: getHorario(),
				quinta_feira: getHorario(),
				sexta_feira: getHorario(),
			},
			nome_fantasia: faker.company.companyName(),
			plantoes,
		});

		await Farmacia.save();
		farmaciasId.push(Farmacia.id);
	}

	return farmaciasId;
}
