import { mapMessage } from "@/constants/message-mapper";
import apiService from "./api.service";
import { PERFORMANCE_METRICS_ENDPOINT } from "@/constants/api-endpoints";

const performanceMetricsService = {
  /**
   * Get all performance metrics
   * @returns {Promise<{success: boolean, data: performanceMetrics[], message: string}>}
   */
  getAll: async () => {
    const response = await apiService.sendRequest(PERFORMANCE_METRICS_ENDPOINT.GET);
    console.log("Performance Metrics Service Get All Response:", response);

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
   * Get performance metrics by ID
   * @param {string} id
   * @returns {Promise<{success: boolean, data: performanceMetrics, message: string}>}
   */
  getById: async (id) => {
    const response = await apiService.sendRequest(PERFORMANCE_METRICS_ENDPOINT.GET_BY_ID(id));
    console.log("Performance Metrics Service Get By ID Response:", response);

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
   * Get performance metrics by vendor ID
   * @param {string} vendorId
   * @returns {Promise<{success: boolean, data: performanceMetrics[], message: string}>}
   */
  getByVendorId: async (vendorId) => {
    const response = await apiService.sendRequest(PERFORMANCE_METRICS_ENDPOINT.GET_BY_VENDOR_ID(vendorId));
    console.log("Performance Metrics Service Get By Vendor ID Response:", response);

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
   * Create performance metrics
   * @param {object} data
   * @returns {Promise<{success: boolean, data: performanceMetrics, message: string}>}
   */
  create: async (data) => {
    const response = await apiService.sendRequest(PERFORMANCE_METRICS_ENDPOINT.CREATE, "POST", data);
    console.log("Performance Metrics Service Create Response:", response);

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
   * Update performance metrics
   * @param {string} id
   * @param {object} data
   * @returns {Promise<{success: boolean, data: performanceMetrics, message: string}>}
   */
  update: async (id, data) => {
    const response = await apiService.sendRequest(PERFORMANCE_METRICS_ENDPOINT.UPDATE(id), "PUT", data);
    console.log("Performance Metrics Service Update Response:", response);

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
   * Delete performance metrics
   * @param {string} id
   * @returns {Promise<{success: boolean, message: string}>}
   */
  delete: async (id) => {
    const response = await apiService.sendRequest(PERFORMANCE_METRICS_ENDPOINT.DELETE(id), "DELETE");
    console.log("Performance Metrics Service Delete Response:", response);

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

export default performanceMetricsService;
