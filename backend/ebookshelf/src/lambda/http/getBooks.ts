import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as middy from "middy";
import { cors } from "middy/middlewares";
import { getToken } from "../../auth/utils";
import { getAllBooks } from "../../businessLogic/books";
import { createLogger } from "../../utils/logger";

const logger = createLogger('getBooks')
export const handler = middy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        try {
            const jwtToken = getToken(event.headers.Authorization)
            const result = await getAllBooks(jwtToken)
            return { 
                statusCode: 200,
                body: JSON.stringify({items: result})
            }
        } catch (error) {
            logger.error(`Error: ${error.message}`)
            return {statusCode:500, body: error.message}
        }
    }
)

handler.use(cors({ credentials: true }))