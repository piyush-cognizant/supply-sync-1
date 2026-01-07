export const API_BASE_URL = 'http://localhost:8000';

export const USER_ENDPOINT = {
    GET: `${API_BASE_URL}/users`,
    GET_BY_ID: (id) => `${API_BASE_URL}/users/${id}`,
    GET_BY_ROLE: (role) => `${API_BASE_URL}/users?role=${role}`,
    GET_BY_EMAIL: (email) => `${API_BASE_URL}/users?email=${email}`,
    CREATE: `${API_BASE_URL}/users`,
    UPDATE: (id) => `${API_BASE_URL}/users/${id}`,
    DELETE: (id) => `${API_BASE_URL}/users/${id}`,
}

export const VENDOR_ENDPOINT = {
    GET: `${API_BASE_URL}/vendors`,
    GET_BY_ID: (id) => `${API_BASE_URL}/vendors/${id}`,
    CREATE: `${API_BASE_URL}/vendors`,
    UPDATE: (id) => `${API_BASE_URL}/vendors/${id}`,
    DELETE: (id) => `${API_BASE_URL}/vendors/${id}`,
}

export const VENDOR_DOCUMENT_ENDPOINT = {
    GET: `${API_BASE_URL}/vendorDocuments`,
    GET_BY_ID: (id) => `${API_BASE_URL}/vendorDocuments/${id}`,
    CREATE: `${API_BASE_URL}/vendorDocuments`,
    UPDATE: (id) => `${API_BASE_URL}/vendorDocuments/${id}`,
    DELETE: (id) => `${API_BASE_URL}/vendorDocuments/${id}`,
}

export const PRODUCTS_ENDPOINT = {
    GET: `${API_BASE_URL}/products`,
    GET_BY_ID: (id) => `${API_BASE_URL}/products/${id}`,
    CREATE: `${API_BASE_URL}/products`,
    UPDATE: (id) => `${API_BASE_URL}/products/${id}`,
    DELETE: (id) => `${API_BASE_URL}/products/${id}`,
}

export const VENDOR_PRODUCTS_ENDPOINT = {
    GET: `${API_BASE_URL}/vendorProducts`,
    GET_BY_ID: (id) => `${API_BASE_URL}/vendorProducts/${id}`,
    GET_BY_VENDOR_ID: (vendorId) => `${API_BASE_URL}/vendorProducts?vendorId=${vendorId}`,
    CREATE: `${API_BASE_URL}/vendorProducts`,
    UPDATE: (id) => `${API_BASE_URL}/vendorProducts/${id}`,
    DELETE: (id) => `${API_BASE_URL}/vendorProducts/${id}`,
}

export const PLANTS_ENDPOINT = {
    GET: `${API_BASE_URL}/plants`,
    GET_BY_ID: (id) => `${API_BASE_URL}/plants/${id}`,
    CREATE: `${API_BASE_URL}/plants`,
    UPDATE: (id) => `${API_BASE_URL}/plants/${id}`,
    DELETE: (id) => `${API_BASE_URL}/plants/${id}`,
}

export const INVENTORY_ENDPOINT = {
    GET: `${API_BASE_URL}/inventory`,
    GET_BY_ID: (id) => `${API_BASE_URL}/inventory/${id}`,
    GET_BY_PLANT_ID: (plantId) => `${API_BASE_URL}/inventory?plantId=${plantId}`,
    GET_BY_PRODUCT_ID: (productId) => `${API_BASE_URL}/inventory?productId=${productId}`,
    CREATE: `${API_BASE_URL}/inventory`,
    UPDATE: (id) => `${API_BASE_URL}/inventory/${id}`,
    DELETE: (id) => `${API_BASE_URL}/inventory/${id}`,
}

export const PURCHASE_ORDERS_ENDPOINT = {
    GET: `${API_BASE_URL}/purchaseOrders`,
    GET_BY_ID: (id) => `${API_BASE_URL}/purchaseOrders/${id}`,
    GET_BY_VENDOR_ID: (vendorId) => `${API_BASE_URL}/purchaseOrders?vendorId=${vendorId}`,
    GET_BY_PLANT_ID: (plantId) => `${API_BASE_URL}/purchaseOrders?plantId=${plantId}`,
    CREATE: `${API_BASE_URL}/purchaseOrders`,
    UPDATE: (id) => `${API_BASE_URL}/purchaseOrders/${id}`,
    DELETE: (id) => `${API_BASE_URL}/purchaseOrders/${id}`,
}

export const PURCHASE_ORDER_ITEMS_ENDPOINT = {
    GET: `${API_BASE_URL}/purchaseOrderItems`,
    GET_BY_ID: (id) => `${API_BASE_URL}/purchaseOrderItems/${id}`,
    GET_BY_PURCHASE_ORDER_ID: (purchaseOrderId) => `${API_BASE_URL}/purchaseOrderItems?purchaseOrderId=${purchaseOrderId}`,
    CREATE: `${API_BASE_URL}/purchaseOrderItems`,
    UPDATE: (id) => `${API_BASE_URL}/purchaseOrderItems/${id}`,
    DELETE: (id) => `${API_BASE_URL}/purchaseOrderItems/${id}`,
}

export const PERFORMANCE_METRICS_ENDPOINT = {
    GET: `${API_BASE_URL}/performanceMetrics`,
    GET_BY_ID: (id) => `${API_BASE_URL}/performanceMetrics/${id}`,
    GET_BY_VENDOR_ID: (vendorId) => `${API_BASE_URL}/performanceMetrics?vendorId=${vendorId}`,
    CREATE: `${API_BASE_URL}/performanceMetrics`,
    UPDATE: (id) => `${API_BASE_URL}/performanceMetrics/${id}`,
    DELETE: (id) => `${API_BASE_URL}/performanceMetrics/${id}`,
}