import {  CustomAuthorizerResult } from "aws-lambda";
import Axios from "axios";
import { decode, verify } from "jsonwebtoken";
import { Jwt } from "../../auth/Jwt";
import { JwtPayload } from "../../auth/JwtPayload";
import { getToken } from "../../auth/utils";
import { createLogger } from "../../utils/logger";

const jwksUrl = process.env.JWKS_URL;
const logger = createLogger("auth0Authorizer");

export const handler = async (
  event
): Promise<CustomAuthorizerResult> => {
  try {
    logger.info(`Authorizing a user => ${event.authorizationToken}`);
    const jwtToken = await verifyToken(event.authorizationToken);
    logger.info('User was authorized', jwtToken)
    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: "Allow",
            Resource: "*",
          },
        ],
      },
    };
  } catch (error) {
    logger.error("Authorization failed: " + error.message);
    return {
      principalId: "user",
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: "Deny",
            Resource: "*",
          },
        ],
      },
    };
  }
};

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader);
  const jwt: Jwt = decode(token, { complete: true }) as Jwt;
  const response = await Axios.get(jwksUrl);
  const certificate_key_id = response.data.keys[0].x5c[0];
  const certificate = certToPEM(certificate_key_id);
  const result = verify(token, certificate, {
    algorithms: [jwt.header.alg],
  }) as JwtPayload;
  logger.info('JWTPayload => ' + JSON.stringify({result}))
  return result;
}

function certToPEM(cert) {
  cert = cert.match(/.{1,64}/g).join("\n");
  cert = `-----BEGIN CERTIFICATE-----\n${cert}\n-----END CERTIFICATE-----\n`;
  return cert;
}
