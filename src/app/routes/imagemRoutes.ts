import { Router, static as static_ } from "express";
import fileUpload from "express-fileupload";
import ImagensControllers from "../controllers/ImagensController";
import AuthenticationMiddleware from "../middlewares/AuthenticationMiddleware";
import VerificarArquivosMiddleware from "../middlewares/files/VerificarArquivosMiddleware";
import VerificarTamanhoMiddleware from "../middlewares/files/VerificarTamanhoMiddleware";
import PermitirExtensoesMiddleware from "../middlewares/files/PermitirExtensoesMiddleware";

const imagemRouter = Router();

imagemRouter.post(
	"/:finalidade/imagem",
	fileUpload({ createParentPath: true }),
	VerificarArquivosMiddleware("imagem"),
	VerificarTamanhoMiddleware,
	PermitirExtensoesMiddleware([".jpg", ".png", ".jpeg"]),
	ImagensControllers.CriarImagem
);

imagemRouter.put(
	"/:finalidade/:id_finalidade/imagem/:caminho",
	fileUpload({ createParentPath: true }),
	VerificarArquivosMiddleware("imagem"),
	VerificarTamanhoMiddleware,
	PermitirExtensoesMiddleware([".jpg", ".png", ".jpeg"]),
	ImagensControllers.ConfirmarEnvio
);

imagemRouter.use("/imagem", static_("files/images"));

imagemRouter.delete("/imagem/:id", ImagensControllers.RemoverImagem);

export default imagemRouter;
