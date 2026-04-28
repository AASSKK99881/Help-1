import apiClient from './client';


export interface AISummaryRequest {

  pageContext: string; 
}


export interface AISummaryResponse {

  summary: string; 
}

export const aiApi = {
  getPageSummary: async (data: AISummaryRequest): Promise<AISummaryResponse> => {
    const response = await apiClient.post<AISummaryResponse>('/ai/summary', data);
    return response.data;
  },
};