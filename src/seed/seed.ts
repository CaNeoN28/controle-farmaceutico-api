import ConnectDB from "../config/database_config";
import entidadeSeed from "./Entidade.seed";
import farmaciasSeed from "./Farmacia.seed";
import usuarioSeed from "./Usuario.seed";

async function seed() {
	const db = await ConnectDB();

	const idsEntidades = await entidadeSeed(1000);
	const idsUsuarios = await usuarioSeed(1000, idsEntidades);
	const idsFarmacia = await farmaciasSeed(1000);

	await db.close()
}

seed();
