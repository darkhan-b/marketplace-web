import { api } from './api';

export const getFavorites = async () => {
  const { data } = await api.get('/favorites');

  return data;
};

export const addToFavorites = async (
  productId: number,
) => {
  const { data } = await api.post(
    `/favorites/${productId}`,
  );

  return data;
};

export const removeFromFavorites = async (
  productId: number,
) => {
  const { data } = await api.delete(
    `/favorites/${productId}`,
  );

  return data;
};