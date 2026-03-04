import api from './apiClient';

export async function getVideoProgress(videoId: string) {
  const res = await api.get(`/progress/videos/${videoId}`);
  return res.data;
}

export async function postVideoProgress(videoId: string, data: any) {
  const res = await api.post(`/progress/videos/${videoId}`, data);
  return res.data;
}