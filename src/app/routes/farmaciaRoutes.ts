import { Router } from "express";
import FarmaciaControllers from "../controllers/FarmaciasControllers";

const farmaciaRoutes = Router()

farmaciaRoutes.get("/farmacias", FarmaciaControllers.ListarFarmacias)
farmaciaRoutes.post("/farmacia", FarmaciaControllers.CriarFarmacia)

farmaciaRoutes.get("/farmacia/proxima", FarmaciaControllers.EncontrarFarmaciaProxima)
farmaciaRoutes.get("/farmacias/plantao", FarmaciaControllers.ListarFarmaciaPorPlantao)

farmaciaRoutes.route("/farmacia/:id")
	.get(FarmaciaControllers.EncontrarFarmaciaPorId)
	.put(FarmaciaControllers.AtualizarFarmacia)
	.delete(FarmaciaControllers.RemoverFarmacia)


export default farmaciaRoutes