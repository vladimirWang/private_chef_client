import {bunApi} from '../utils/requestGenerator'

export const uploadImageToOss = () => {
    return bunApi("/chat/a")
} 
export const streamChat  = () => {
    return bunApi("/chat/a")
} 
export const clearChatHistory = (threadId: string) => {
    return bunApi("/chat/a")
} 