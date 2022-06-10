import axios from "axios";

const apiUrl = 'http://localhost:3002/api/';

export const HTTP = {
    get: <T>(url: string): Promise<T> => axios.get<T>(apiUrl + url).then(x => x.data),
    post: <T>(url: string, data: any): Promise<T> => axios.post<T>(apiUrl + url, data).then(x => x.data),
    delete: (url: string): Promise<void> => axios.delete(apiUrl + url),
    put: <T>(url: string, data: any): Promise<T> => axios.put<T>(apiUrl + url, data).then(x => x.data)
}