import { bunApi } from "../utils/requestGenerator";

export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await bunApi.post("/util/uploadFile", formData);
  return response;
}

export const sendEmailVerificationCode = async (email: string) => {

  return await bunApi.get(`/util/sendEmailVerificationCode/${encodeURIComponent(email)}`);
}

export const verifyEmail = async (data: {email: string, code: string}) => {
  return await bunApi.post("/util/verifyEmail", data);
}