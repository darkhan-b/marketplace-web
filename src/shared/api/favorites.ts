import { api } from './api';

export const addToFavorites = async (productId: number) => {
  const { data } = await api.post(`/favorites/${productId}`);

  return data;
};