import {bunApi} from '../utils/requestGenerator'

interface IUserRegister {
    email: string;
    password: string;
    nickname: string;
}
export const userRegister = (data: IUserRegister) => {
    return bunApi.post("/user/register", data)
}

interface IUserLogin {
    email: string;
    password: string;
}
export const userLogin = (data: IUserLogin) => {
    return bunApi.post("/user/login", data)
}