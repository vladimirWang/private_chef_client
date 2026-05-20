import {bunApi} from '../utils/requestGenerator'

interface IUserRegister {
    email: string;
    password: string;
    nickname: string;
}
export const userRegister = (data: IUserRegister, config?: { showSuccessMessage?: boolean }) => {
    return bunApi.post("/user/register", data, {
        showSuccessMessage: config?.showSuccessMessage
    })
}

export interface IUserLoginRequest {
    email: string;
    password: string;
    nonce: string;
}
interface IUserLoginResponse {
    token: string;
}
export const userLogin = (data: IUserLoginRequest) => {
    return bunApi.post<IUserLoginResponse>("/user/login", data)
}

export const getUserSalt = (email: string) => {
    return bunApi.get<string>(`/user/getSalt/${encodeURIComponent(email)}`)
}