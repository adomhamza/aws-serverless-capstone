import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import * as middy from "middy";
import { cors } from "middy/middlewares";
import { getToken } from "../../auth/utils";
import { deleteBook } from "../../businessLogic/books";
import { createLogger } from "../../utils/logger";

const logger = createLogger('deleteBook')
export const handler = middy(
    async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
        const bookId = event.pathParameters.bookId
        const jwtToken = getToken(event.headers.Authorization)
        try {
            await deleteBook(bookId, jwtToken)
            return { statusCode: 200, body: ''}
        } catch (error) {
            logger.error(`Error ${error.message}`)
            return { statusCode:500, body: error.message }
        }
        
    }
)

handler.use(cors({ credentials: true}))