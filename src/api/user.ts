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

interface IUserLogin {
    email: string;
    password: string;
    nonce: string;
}
interface IUserLoginResponse {
    token: string;
}
export const userLogin = (data: IUserLogin) => {
    return bunApi.post<IUserLoginResponse>("/user/login", data)
}

export const getUserSalt = (email: string) => {
    return bunApi.get<string>(`/user/getSalt/${encodeURIComponent(email)}`)
}