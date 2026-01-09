import { mapMessage } from "@/constants/message-mapper";
import apiService from "./api.service";
import { VENDOR_PRODUCTS_ENDPOINT } from "@/constants/api-endpoints";

const vendorProductService = {
  /**
   * Get all vendor products
   * @returns {Promise<{success: boolean, data: vendorProduct[], message: string}>}
   */
  getAll: async () => {
    const response = await apiService.sendRequest(VENDOR_PRODUCTS_ENDPOINT.GET);
    console.log("Vendor Product Service Get All Response:", response);

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
   * Get vendor product by ID
   * @param {string} id
   * @returns {Promise<{success: boolean, data: vendorProduct, message: string}>}
   */
  getById: async (id) => {
    const response = await apiService.sendRequest(VENDOR_PRODUCTS_ENDPOINT.GET_BY_ID(id));
    console.log("Vendor Product Service Get By ID Response:", response);

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
   * Get vendor products by vendor ID
   * @param {string} vendorId
   * @returns {Promise<{success: boolean, data: vendorProduct[], message: string}>}
   */
  getByVendorId: async (vendorId) => {
    const response = await apiService.sendRequest(VENDOR_PRODUCTS_ENDPOINT.GET_BY_VENDOR_ID(vendorId));
    console.log("Vendor Product Service Get By Vendor ID Response:", response);

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
   * Create vendor product
   * @param {object} data
   * @returns {Promise<{success: boolean, data: vendorProduct, message: string}>}
   */
  create: async (data) => {
    const response = await apiService.sendRequest(VENDOR_PRODUCTS_ENDPOINT.CREATE, "POST", data);
    console.log("Vendor Product Service Create Response:", response);

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
   * Update vendor product
   * @param {string} id
   * @param {object} data
   * @returns {Promise<{success: boolean, data: vendorProduct, message: string}>}
   */
  update: async (id, data) => {
    const response = await apiService.sendRequest(VENDOR_PRODUCTS_ENDPOINT.UPDATE(id), "PUT", data);
    console.log("Vendor Product Service Update Response:", response);

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
   * Delete vendor product
   * @param {string} id
   * @returns {Promise<{success: boolean, message: string}>}
   */
  delete: async (id) => {
    const response = await apiService.sendRequest(VENDOR_PRODUCTS_ENDPOINT.DELETE(id), "DELETE");
    console.log("Vendor Product Service Delete Response:", response);

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

export default vendorProductService;
