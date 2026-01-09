import { mapMessage } from "@/constants/message-mapper";
import apiService from "./api.service";
import { INVENTORY_ENDPOINT } from "@/constants/api-endpoints";

const inventoryService = {
  /**
   * Get all inventory
   * @returns {Promise<{success: boolean, data: inventory[], message: string}>}
   */
  getAll: async () => {
    const response = await apiService.sendRequest(INVENTORY_ENDPOINT.GET);
    console.log("Inventory Service Get All Response:", response);

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
   * Get inventory by ID
   * @param {string} id
   * @returns {Promise<{success: boolean, data: inventory, message: string}>}
   */
  getById: async (id) => {
    const response = await apiService.sendRequest(INVENTORY_ENDPOINT.GET_BY_ID(id));
    console.log("Inventory Service Get By ID Response:", response);

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
   * Get inventory by plant ID
   * @param {string} plantId
   * @returns {Promise<{success: boolean, data: inventory[], message: string}>}
   */
  getByPlantId: async (plantId) => {
    const response = await apiService.sendRequest(INVENTORY_ENDPOINT.GET_BY_PLANT_ID(plantId));
    console.log("Inventory Service Get By Plant ID Response:", response);

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
   * Get inventory by product ID
   * @param {string} productId
   * @returns {Promise<{success: boolean, data: inventory[], message: string}>}
   */
  getByProductId: async (productId) => {
    const response = await apiService.sendRequest(INVENTORY_ENDPOINT.GET_BY_PRODUCT_ID(productId));
    console.log("Inventory Service Get By Product ID Response:", response);

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
   * Create inventory
   * @param {object} data
   * @returns {Promise<{success: boolean, data: inventory, message: string}>}
   */
  create: async (data) => {
    const response = await apiService.sendRequest(INVENTORY_ENDPOINT.CREATE, "POST", data);
    console.log("Inventory Service Create Response:", response);

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
   * Update inventory
   * @param {string} id
   * @param {object} data
   * @returns {Promise<{success: boolean, data: inventory, message: string}>}
   */
  update: async (id, data) => {
    const response = await apiService.sendRequest(INVENTORY_ENDPOINT.UPDATE(id), "PUT", data);
    console.log("Inventory Service Update Response:", response);

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
   * Delete inventory
   * @param {string} id
   * @returns {Promise<{success: boolean, message: string}>}
   */
  delete: async (id) => {
    const response = await apiService.sendRequest(INVENTORY_ENDPOINT.DELETE(id), "DELETE");
    console.log("Inventory Service Delete Response:", response);

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

export default inventoryService;
