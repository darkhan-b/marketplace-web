import { api } from "./api";

export type OrderStatus = "PENDING" | "PAID" | "CANCELLED";

export const createOrder = async () => {
  const { data } = await api.post("/orders");

  return data;
};


export const getMyOrders = async () => {
  const { data } = await api.get("/orders/my");

  return data;
};

export const getOrder = async (id: number) => {
  const { data } = await api.get(`/orders/${id}`);

  return data;
};

export const getAllOrders = async () => {
  const { data } = await api.get("/orders");

  return data;
};

export const updateOrderStatus = async (id: number, status: OrderStatus) => {
  const { data } = await api.patch(`/orders/${id}/status`, {
    status,
  });

  return data;
};
