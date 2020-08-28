import Axios from "axios";
import { apiEndpoint } from "../config";
import { Book } from "../types/Book";
import { CreateBookRequest } from "../types/CreateBookRequest";

export async function getBooks(idToken: string): Promise<Book[]> {
    console.log('fetching books')

    const response = await Axios.get(`${apiEndpoint}/books`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
        },
    })
    console.log(`Books: ${response.data}`)
    return response.data.items
}

export async function createBook(idToken: string, newBook: CreateBookRequest): Promise<Book> {
    console.log(JSON.stringify(newBook) + 'from createBook() books-api')
    const response = await Axios.post(`${apiEndpoint}/books`, JSON.stringify(newBook), {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
        }
    })
    return response.data.item
}

export async function deleteBook(idToken: string, bookId: string): Promise<void> {
    const response = await Axios.delete(`${apiEndpoint}/books/${bookId}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
        }
    })
}

export async function getUploadUrl(
    idToken: string, 
    bookId: string
    ): Promise<string> {
    const url: string = `${apiEndpoint}/books/${bookId}/attachment`
    console.log('Url: ' + url)
    console.log('idToken: ' + idToken)
    const response = await Axios.post(url, '', {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
        }
    })
    console.log('getupload url \n'+ JSON.stringify({response}))
    return response.data
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
    await Axios.put(uploadUrl, file)
}