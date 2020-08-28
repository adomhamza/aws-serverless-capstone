import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as middy from "middy";
import { cors } from "middy/middlewares";
import { getToken } from "../../auth/utils";
import { createBook } from "../../businessLogic/books";
import { CreateBookRequest } from "../../request/CreateBookRequest";
import { createLogger } from "../../utils/logger";


const logger = createLogger('create-book')
export const handler = middy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        try {
        const jwtToken = getToken(event.headers.Authorization)
        const newBook: CreateBookRequest = JSON.parse(event.body)
        const newItem = await createBook(newBook, jwtToken)

        return { 
            statusCode: 200,
            body: JSON.stringify({item:newItem})
        }
        } catch (error) {
            logger.error(error.message)
            return { 
                statusCode: 500,
                body: error.message
            }
           
        }
        
    }
)

handler.use(cors({credentials:true}))