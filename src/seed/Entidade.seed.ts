import EntidadeModel from "../app/models/Entidade";
import faker from "faker-br";
import getEstadoEMunicipio from "../app/utils/getEstadoEMunicipio";

export default async function entidadeSeed(instancias: number) {
	await EntidadeModel.deleteMany();

	const ids: string[] = [];

	for (let i = 0; i < instancias; i++) {
		const {estado, municipio} = getEstadoEMunicipio()

		const Entidade = new EntidadeModel({
			ativo: Math.random() >= 0.5,
			estado,
			municipio,
			nome_entidade: faker.company.companyName(),
		});

		await Entidade.save();
		ids.push(Entidade.id);
	}

	return ids;
}
