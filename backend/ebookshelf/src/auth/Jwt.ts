import { JwtHeader } from "jsonwebtoken";
import { JwtPayload } from "./JwtPayload";

export interface Jwt {
    header: JwtHeader;
    payload: JwtPayload;
}