export function getAccessToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
}

export function setAccessToken(token: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('accessToken', token);
}

export function clearTokens() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('accessToken');
}