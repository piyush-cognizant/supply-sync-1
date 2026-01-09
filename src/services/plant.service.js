import { mapMessage } from "@/constants/message-mapper";
import apiService from "./api.service";
import { PLANTS_ENDPOINT } from "@/constants/api-endpoints";

const plantService = {
  /**
   * Get all plants
   * @returns {Promise<{success: boolean, data: plant[], message: string}>}
   */
  getAll: async () => {
    const response = await apiService.sendRequest(PLANTS_ENDPOINT.GET);
    console.log("Plant Service Get All Response:", response);

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
   * Get plant by ID
   * @param {string} id
   * @returns {Promise<{success: boolean, data: plant, message: string}>}
   */
  getById: async (id) => {
    const response = await apiService.sendRequest(PLANTS_ENDPOINT.GET_BY_ID(id));
    console.log("Plant Service Get By ID Response:", response);

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
   * Create plant
   * @param {object} data
   * @returns {Promise<{success: boolean, data: plant, message: string}>}
   */
  create: async (data) => {
    const response = await apiService.sendRequest(PLANTS_ENDPOINT.CREATE, "POST", data);
    console.log("Plant Service Create Response:", response);

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
   * Update plant
   * @param {string} id
   * @param {object} data
   * @returns {Promise<{success: boolean, data: plant, message: string}>}
   */
  update: async (id, data) => {
    const response = await apiService.sendRequest(PLANTS_ENDPOINT.UPDATE(id), "PUT", data);
    console.log("Plant Service Update Response:", response);

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
   * Delete plant
   * @param {string} id
   * @returns {Promise<{success: boolean, message: string}>}
   */
  delete: async (id) => {
    const response = await apiService.sendRequest(PLANTS_ENDPOINT.DELETE(id), "DELETE");
    console.log("Plant Service Delete Response:", response);

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

export default plantService;
