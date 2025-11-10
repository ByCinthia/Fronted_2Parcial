import { apiGet, apiPost, apiPatch, apiDelete } from "./api";

export type OrderItemPayload = {
  producto_id?: number | string;
  nombre?: string;
  cantidad?: number;
  precio?: number;
};

export type CreateOrderPayload = {
  items: OrderItemPayload[];
  total: number;
  metodo_pago: "tarjeta" | "efectivo" | "recoger";
  datos_cliente: { nombre: string; direccion?: string; telefono?: string };
  recoger_hasta?: string | null;
  pago_tarjeta?: Record<string, unknown> | null;
};

export async function listOrders() {
  return apiGet("/api/pedidos/");
}

export async function getOrder(id: number | string) {
  return apiGet(`/api/pedidos/${id}/`);
}

export async function createOrder(payload: CreateOrderPayload) {
  return apiPost("/api/pedidos/", payload);
}

export async function updateOrder(id: number | string, payload: Partial<CreateOrderPayload>) {
  return apiPatch(`/api/pedidos/${id}/`, payload);
}

export async function deleteOrder(id: number | string) {
  return apiDelete(`/api/pedidos/${id}/`);
}