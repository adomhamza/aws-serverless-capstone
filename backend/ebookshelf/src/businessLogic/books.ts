import { v4 } from "uuid";
import { parseUserId } from "../auth/utils";
import { BookAccess } from "../dataLayer/bookAccess";
import { BookItem } from "../model/BookItem";
import { CreateBookRequest } from "../request/CreateBookRequest";
import { createLogger } from "../utils/logger";

const logger = createLogger('book')
const bookAccess = new BookAccess()
const bucketName = process.env.BOOKS_S3_BUCKET

export const createBook = async (createBookRequest: CreateBookRequest, jwtToken: string): Promise<BookItem> => {
    const userId = parseUserId(jwtToken)
    const bookId = v4()
    const bookItem: BookItem = {
        bookId: bookId,
        ...createBookRequest,
        userId,
        attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${bookId}`,
        createdAt: new Date().toISOString()
    }
    const result = JSON.stringify({bookItem})
    logger.info(`Book created >>> ${result}`)
    return await bookAccess.createBook(bookItem)

}

export const deleteBook = async (bookId:string, jwtToken: string) : Promise<string> => {
    const userId = parseUserId(jwtToken)
    logger.info(`Book deleted with id ${bookId}`)
    return await bookAccess.deleteBook(bookId, userId)
}

export const getAllBooks = async (jwtToken:string) : Promise<BookItem[]> => {
    const userId = parseUserId(jwtToken)
    return await bookAccess.getUserBooks(userId)
}

export const generateUploadUrl = async (bookId: string): Promise<string> => {
    logger.info(`in generateUploadUrl() function`)
    return await bookAccess.generateUploadUrl(bookId)
}