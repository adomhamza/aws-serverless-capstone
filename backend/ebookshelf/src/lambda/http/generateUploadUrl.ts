import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as middy from "middy";
import { createLogger } from "../../utils/logger";
import { cors } from 'middy/middlewares'
import { generateUploadUrl } from "../../businessLogic/books";

const logger = createLogger('generateUploadUrl')
export const handler = middy(
    async (event:APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        try { 
        const bookId = event.pathParameters.bookId
        const uploadUrl = await generateUploadUrl(bookId)
        return { statusCode:200, body:JSON.stringify(uploadUrl)}
    } catch (error) {
        logger.error(`Error: ${error.message}`)
        return { statusCode:500, body:error.message}
    }
}
)

handler.use(cors({ credentials: true}))