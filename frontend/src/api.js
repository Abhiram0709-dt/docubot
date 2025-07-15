import axios from "axios";

const API_URL = "http://localhost:8000";

export const uploadDocument = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return axios.post(`${API_URL}/upload`, formData);
};

export const listDocuments = () => axios.get(`${API_URL}/documents`);

export const deleteDocument = (doc_id) =>
  axios.delete(`${API_URL}/documents/${doc_id}`);

export const askQuestion = (doc_id, question) =>
  axios.post(`${API_URL}/ask`, { doc_id, question }); 