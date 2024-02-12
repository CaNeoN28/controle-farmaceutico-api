import { Router } from "express";
import FarmaciaControllers from "../controllers/FarmaciasControllers";
import AuthenticationMiddleware from "../middlewares/AuthenticationMiddleware";

const farmaciaRoutes = Router()

farmaciaRoutes.get("/farmacias", FarmaciaControllers.ListarFarmacias)
farmaciaRoutes.post("/farmacia", AuthenticationMiddleware, FarmaciaControllers.CriarFarmacia)

farmaciaRoutes.get("/farmacias/proximas", FarmaciaControllers.EncontrarFarmaciasProximas)
farmaciaRoutes.get("/farmacias/plantao", FarmaciaControllers.ListarFarmaciaPorPlantao)

farmaciaRoutes.route("/farmacia/:id")
	.get(FarmaciaControllers.EncontrarFarmaciaPorId)
	.put(AuthenticationMiddleware, FarmaciaControllers.AtualizarFarmacia)
	.delete(AuthenticationMiddleware, FarmaciaControllers.RemoverFarmacia)


export default farmaciaRoutes