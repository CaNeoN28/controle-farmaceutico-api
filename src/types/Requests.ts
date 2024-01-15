import { Request } from "express";
import TokenData from "./TokenData";

interface AuthenticatedRequest extends Request {
	user?: TokenData
}

export {
	AuthenticatedRequest
}