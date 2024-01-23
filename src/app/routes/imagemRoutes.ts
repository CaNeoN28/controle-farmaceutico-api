import { Router } from "express";
import ImagensControllers from "../controllers/ImagensController";

const imagemRouter = Router();

imagemRouter.post("/imagem", ImagensControllers.EnviarImagem);

imagemRouter
	.route("/imagem/:id")
	.get(ImagensControllers.EncontrarImagemPorId)
	.delete(ImagensControllers.RemoverImagem);

export default imagemRouter;
