import { decode } from "jsonwebtoken"
import { JwtPayload } from "./JwtPayload"


/**
 * 
 * @param authHeader 
 * returns a token for authentication
 */
export function getToken(authHeader: string) : string {
    if(!authHeader)  throw new Error('No auth header') 
    
    if(!authHeader.toLowerCase().startsWith('bearer')) {
        throw new Error('Invalid auth header')
    }

    const split = authHeader.split(' ')
    const token = split[1]
    return token
}

/**
 * @param jwtToken
 * returns userId
 */
export function parseUserId(jwtToken): string {
    const decodedJwt = decode(jwtToken) as JwtPayload
    return decodedJwt.sub
}