import { api } from './api';

export const addToCart = async (productId: number, quantity = 1) => {
  const { data } = await api.post('/cart', {
    productId,
    quantity,
  });

  return data;
};