import {bunApi} from '../utils/requestGenerator'

export const uploadImageToOss = () => {
    return bunApi.post("/chat/a")
} 
export const streamChat  = () => {
    return bunApi.post("/chat/a")
} 
export const clearChatHistory = (threadId: string) => {
    return bunApi.post("/chat/a")
} 