import { DocumentClient } from "aws-sdk/lib/dynamodb/document_client";
import { BookItem } from "../model/BookItem";
import { createLogger } from "../utils/logger";
import * as AWS from "aws-sdk"
import * as AWSXRay from 'aws-xray-sdk-core'


const logger = createLogger('bookAccess')
const XAWS  = AWSXRay.captureAWS(AWS)

export class BookAccess {
    constructor(    
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly s3 = new XAWS.S3({ signatureVersion:'v4'}),
        private readonly bucketName = process.env.BOOKS_S3_BUCKET,
        private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION,
        private readonly booksTable = process.env.BOOKS_TABLE,
        private readonly userIdIndex = process.env.USER_ID_INDEX
    ) {}

    async getUserBooks(userId: string): Promise<BookItem[]> {
        const result = await this.docClient.query({
            TableName: this.booksTable,
            IndexName: this.userIdIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }

        }).promise()
        logger.info('Book list: ' + JSON.stringify({result}))
        return result.Items as BookItem[]
    }

    async createBook(book: BookItem): Promise<BookItem> {
        const item = {
            ...book
        }
        
        const result = await this.docClient.put({
            TableName: this.booksTable,
            Item: item
        }).promise()
        logger.info(`Book created: ${JSON.stringify(result)}`)
        return book;
    }

    
    async deleteBook(bookId: string, userId: string): Promise<string> {
        logger.info('Delete book with id: ' + bookId)
        await this.docClient.delete({
            TableName: this.booksTable,
            Key: {
                userId, 
                bookId
            },
            ConditionExpression: 'bookId = :bookId',
            ExpressionAttributeValues: {
                ':bookId': bookId
            }
        }).promise()

        return userId
    }

    async generateUploadUrl(bookId: string): Promise<string> {
        const result = this.s3.getSignedUrl('putObject', {
            Bucket: this.bucketName,
            Key: bookId,
            Expires: parseInt(this.urlExpiration, 10)
        })
        logger.info('upload: >>>' + result)
        return result
    }
}