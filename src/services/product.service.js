import { mapMessage } from "@/constants/message-mapper";
import apiService from "./api.service";
import { PRODUCTS_ENDPOINT } from "@/constants/api-endpoints";

const productService = {
  /**
   * Get all products
   * @returns {Promise<{success: boolean, data: product[], message: string}>}
   */
  getAll: async () => {
    const response = await apiService.sendRequest(PRODUCTS_ENDPOINT.GET);
    console.log("Product Service Get All Response:", response);

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
   * Get product by ID
   * @param {string} id
   * @returns {Promise<{success: boolean, data: product, message: string}>}
   */
  getById: async (id) => {
    const response = await apiService.sendRequest(PRODUCTS_ENDPOINT.GET_BY_ID(id));
    console.log("Product Service Get By ID Response:", response);

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
   * Create product
   * @param {object} data
   * @returns {Promise<{success: boolean, data: product, message: string}>}
   */
  create: async (data) => {
    const response = await apiService.sendRequest(PRODUCTS_ENDPOINT.CREATE, "POST", data);
    console.log("Product Service Create Response:", response);

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
   * Update product
   * @param {string} id
   * @param {object} data
   * @returns {Promise<{success: boolean, data: product, message: string}>}
   */
  update: async (id, data) => {
    const response = await apiService.sendRequest(PRODUCTS_ENDPOINT.UPDATE(id), "PUT", data);
    console.log("Product Service Update Response:", response);

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
   * Delete product
   * @param {string} id
   * @returns {Promise<{success: boolean, message: string}>}
   */
  delete: async (id) => {
    const response = await apiService.sendRequest(PRODUCTS_ENDPOINT.DELETE(id), "DELETE");
    console.log("Product Service Delete Response:", response);

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

export default productService;
