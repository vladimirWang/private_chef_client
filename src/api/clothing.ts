import { pyApi } from "../utils/requestGenerator";

export const updateKnowledgeBase = async (data: {filepath: string}) => {
  const response = await pyApi.post("/api/v1/clothing/upload", data);
  return response;
}

/** RAG + LLM 耗时常超过全局 pyApi 的 10s timeout，单独放宽 */
const CONSULT_TIMEOUT_MS = 180_000;

export const consultKnowledgeBase = async (data: { question: string }) => {
  const response = await pyApi.post("/api/v1/clothing/consult", data, {
    timeout: CONSULT_TIMEOUT_MS,
  });
  return response;
};