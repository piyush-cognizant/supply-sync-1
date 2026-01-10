import { mapMessage } from "@/constants/message-mapper";
import apiService from "./api.service";
import { PURCHASE_ORDERS_ENDPOINT, PURCHASE_ORDER_ITEMS_ENDPOINT } from "@/constants/api-endpoints";
import { getCurrentUTC } from "@/lib/date-time";

const purchaseOrderService = {
  /**
   * Get all purchase orders with optional pagination
   * @param {object} params - Query parameters for pagination and filtering
   * @param {number} params._page - Page number (1-based)
   * @param {number} params._limit - Items per page
   * @param {string} params._sort - Field to sort by
   * @param {string} params._order - Sort order (asc/desc)
   * @returns {Promise<{success: boolean, data: purchaseOrder[], total: number, message: string}>}
   */
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params._page) queryParams.append('_page', params._page);
    if (params._limit) queryParams.append('_limit', params._limit);
    if (params._sort) queryParams.append('_sort', params._sort);
    if (params._order) queryParams.append('_order', params._order);

    const endpoint = queryParams.toString() 
      ? `${PURCHASE_ORDERS_ENDPOINT.GET}?${queryParams.toString()}`
      : PURCHASE_ORDERS_ENDPOINT.GET;

    const response = await apiService.sendRequest(endpoint);
    console.log("Purchase Order Service Get All Response:", response);

    if (response.success) {
      return {
        success: true,
        data: response.data,
        total: parseInt(response.headers?.['x-total-count'] || response.data?.length || 0, 10),
        message: mapMessage("FETCH_SUCCESS"),
      };
    }

    return {
      success: false,
      data: null,
      total: 0,
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

    if (response.success && response.data) {
      // json-server returns object directly for /resource/:id
      const data = Array.isArray(response.data) ? response.data[0] : response.data;
      return {
        success: true,
        data,
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
   * Create purchase order with items
   * @param {object} orderData - Purchase order data
   * @param {array} items - Array of purchase order items
   * @returns {Promise<{success: boolean, data: purchaseOrder, message: string}>}
   */
  create: async (orderData, items = []) => {
    const purchaseOrderPayload = {
      ...orderData,
      orderDate: getCurrentUTC(),
    };

    const response = await apiService.sendRequest(PURCHASE_ORDERS_ENDPOINT.CREATE, "POST", purchaseOrderPayload);
    console.log("Purchase Order Service Create Response:", response);

    if (response.success && items.length > 0) {
      const purchaseOrderId = response.data.id;
      
      // Create all purchase order items
      const itemPromises = items.map(item => 
        apiService.sendRequest(PURCHASE_ORDER_ITEMS_ENDPOINT.CREATE, "POST", {
          ...item,
          purchaseOrderId,
        })
      );

      try {
        await Promise.all(itemPromises);
      } catch (error) {
        console.error("Error creating purchase order items:", error);
      }
    }

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
