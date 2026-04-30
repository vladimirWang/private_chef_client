import { bunApi } from "../utils/requestGenerator";

export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await bunApi.post("/util/uploadFile", formData);
  return response;
}