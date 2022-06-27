import axios from "axios";

const apiUrl = 'http://localhost:3002/api/';

const authorization = () => ({ 'Authorization': localStorage.getItem('token')!});

export const HTTP = {
    get: <T>(url: string): Promise<T> => axios.get<T>(apiUrl + url, { headers: authorization() }).then(x => x.data),
    post: <T>(url: string, data: any): Promise<T> => axios.post<T>(apiUrl + url, data, { headers: authorization() }).then(x => x.data),
    delete: (url: string): Promise<void> => axios.delete(apiUrl + url, { headers: authorization() }),
    put: <T>(url: string, data: any): Promise<T> => axios.put<T>(apiUrl + url, data, { headers: authorization() }).then(x => x.data)
}