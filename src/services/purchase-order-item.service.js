import { mapMessage } from "@/constants/message-mapper";
import apiService from "./api.service";
import { PURCHASE_ORDER_ITEMS_ENDPOINT } from "@/constants/api-endpoints";

const purchaseOrderItemService = {
  /**
   * Get all purchase order items
   * @returns {Promise<{success: boolean, data: purchaseOrderItem[], message: string}>}
   */
  getAll: async () => {
    const response = await apiService.sendRequest(PURCHASE_ORDER_ITEMS_ENDPOINT.GET);
    console.log("Purchase Order Item Service Get All Response:", response);

    if (response.success) {
      return {
        success: true,
        data: response.data,
        message: mapMessage("FETCH_SUCCESS"),
      };
    }

    return {
      success: false,
      data: null,
      message: mapMessage("SERVER_ERROR"),
    };
  },

  /**
   * Get purchase order item by ID
   * @param {string} id
   * @returns {Promise<{success: boolean, data: purchaseOrderItem, message: string}>}
   */
  getById: async (id) => {
    const response = await apiService.sendRequest(PURCHASE_ORDER_ITEMS_ENDPOINT.GET_BY_ID(id));
    console.log("Purchase Order Item Service Get By ID Response:", response);

    if (response.success) {
      return {
        success: true,
        data: response.data[0],
        message: mapMessage("FETCH_SUCCESS"),
      };
    }

    return {
      success: false,
      data: null,
      message: mapMessage("SERVER_ERROR"),
    };
  },

  /**
   * Get purchase order items by purchase order ID
   * @param {string} purchaseOrderId
   * @returns {Promise<{success: boolean, data: purchaseOrderItem[], message: string}>}
   */
  getByPurchaseOrderId: async (purchaseOrderId) => {
    const response = await apiService.sendRequest(PURCHASE_ORDER_ITEMS_ENDPOINT.GET_BY_PURCHASE_ORDER_ID(purchaseOrderId));
    console.log("Purchase Order Item Service Get By Purchase Order ID Response:", response);

    if (response.success) {
      return {
        success: true,
        data: response.data,
        message: mapMessage("FETCH_SUCCESS"),
      };
    }

    return {
      success: false,
      data: null,
      message: mapMessage("SERVER_ERROR"),
    };
  },

  /**
   * Create purchase order item
   * @param {object} data
   * @returns {Promise<{success: boolean, data: purchaseOrderItem, message: string}>}
   */
  create: async (data) => {
    const response = await apiService.sendRequest(PURCHASE_ORDER_ITEMS_ENDPOINT.CREATE, "POST", data);
    console.log("Purchase Order Item Service Create Response:", response);

    if (response.success) {
      return {
        success: true,
        data: response.data,
        message: mapMessage("CREATE_SUCCESS"),
      };
    }

    return {
      success: false,
      data: null,
      message: mapMessage("SERVER_ERROR"),
    };
  },

  /**
   * Update purchase order item
   * @param {string} id
   * @param {object} data
   * @returns {Promise<{success: boolean, data: purchaseOrderItem, message: string}>}
   */
  update: async (id, data) => {
    const response = await apiService.sendRequest(PURCHASE_ORDER_ITEMS_ENDPOINT.UPDATE(id), "PUT", data);
    console.log("Purchase Order Item Service Update Response:", response);

    if (response.success) {
      return {
        success: true,
        data: response.data,
        message: mapMessage("UPDATE_SUCCESS"),
      };
    }

    return {
      success: false,
      data: null,
      message: mapMessage("SERVER_ERROR"),
    };
  },

  /**
   * Delete purchase order item
   * @param {string} id
   * @returns {Promise<{success: boolean, message: string}>}
   */
  delete: async (id) => {
    const response = await apiService.sendRequest(PURCHASE_ORDER_ITEMS_ENDPOINT.DELETE(id), "DELETE");
    console.log("Purchase Order Item Service Delete Response:", response);

    if (response.success) {
      return {
        success: true,
        message: mapMessage("DELETE_SUCCESS"),
      };
    }

    return {
      success: false,
      message: mapMessage("SERVER_ERROR"),
    };
  },
};

export default purchaseOrderItemService;
