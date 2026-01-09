import { mapMessage } from "@/constants/message-mapper";
import apiService from "./api.service";
import { PURCHASE_ORDERS_ENDPOINT } from "@/constants/api-endpoints";

const purchaseOrderService = {
  /**
   * Get all purchase orders
   * @returns {Promise<{success: boolean, data: purchaseOrder[], message: string}>}
   */
  getAll: async () => {
    const response = await apiService.sendRequest(PURCHASE_ORDERS_ENDPOINT.GET);
    console.log("Purchase Order Service Get All Response:", response);

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
   * Get purchase order by ID
   * @param {string} id
   * @returns {Promise<{success: boolean, data: purchaseOrder, message: string}>}
   */
  getById: async (id) => {
    const response = await apiService.sendRequest(PURCHASE_ORDERS_ENDPOINT.GET_BY_ID(id));
    console.log("Purchase Order Service Get By ID Response:", response);

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
   * Get purchase orders by vendor ID
   * @param {string} vendorId
   * @returns {Promise<{success: boolean, data: purchaseOrder[], message: string}>}
   */
  getByVendorId: async (vendorId) => {
    const response = await apiService.sendRequest(PURCHASE_ORDERS_ENDPOINT.GET_BY_VENDOR_ID(vendorId));
    console.log("Purchase Order Service Get By Vendor ID Response:", response);

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
   * Get purchase orders by plant ID
   * @param {string} plantId
   * @returns {Promise<{success: boolean, data: purchaseOrder[], message: string}>}
   */
  getByPlantId: async (plantId) => {
    const response = await apiService.sendRequest(PURCHASE_ORDERS_ENDPOINT.GET_BY_PLANT_ID(plantId));
    console.log("Purchase Order Service Get By Plant ID Response:", response);

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
   * Create purchase order
   * @param {object} data
   * @returns {Promise<{success: boolean, data: purchaseOrder, message: string}>}
   */
  create: async (data) => {
    const response = await apiService.sendRequest(PURCHASE_ORDERS_ENDPOINT.CREATE, "POST", data);
    console.log("Purchase Order Service Create Response:", response);

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
   * Update purchase order
   * @param {string} id
   * @param {object} data
   * @returns {Promise<{success: boolean, data: purchaseOrder, message: string}>}
   */
  update: async (id, data) => {
    const response = await apiService.sendRequest(PURCHASE_ORDERS_ENDPOINT.UPDATE(id), "PUT", data);
    console.log("Purchase Order Service Update Response:", response);

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
   * Delete purchase order
   * @param {string} id
   * @returns {Promise<{success: boolean, message: string}>}
   */
  delete: async (id) => {
    const response = await apiService.sendRequest(PURCHASE_ORDERS_ENDPOINT.DELETE(id), "DELETE");
    console.log("Purchase Order Service Delete Response:", response);

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

export default purchaseOrderService;
