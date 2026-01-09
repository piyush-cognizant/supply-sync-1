import { mapMessage } from "@/constants/message-mapper";
import apiService from "./api.service";
import { USER_ENDPOINT } from "@/constants/api-endpoints";

const userService = {
  /**
   * Get all users
   * @returns {Promise<{success: boolean, data: user[], message: string}>}
   */
  getAll: async () => {
    const response = await apiService.sendRequest(USER_ENDPOINT.GET);
    console.log("User Service Get All Response:", response);

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
   * Get user by ID
   * @param {string} id - User ID
   * @returns {Promise<{success: boolean, data: user, message: string}>}
   */
  getById: async (id) => {
    const response = await apiService.sendRequest(USER_ENDPOINT.GET_BY_ID(id));
    console.log("User Service Get By ID Response:", response);

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
   * Get user by email
   * @param {string} email - User email
   * @returns {Promise<{success: boolean, data: user, message: string}>}
   */
  getByEmail: async (email) => {
    const response = await apiService.sendRequest(USER_ENDPOINT.GET_BY_EMAIL(email));
    console.log("User Service Get By Email Response:", response);

    if (response.success && response.data.length > 0) {
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
   * Create a new user
   * @param {object} userData - User data (email, password, role, etc.)
   * @returns {Promise<{success: boolean, data: user, message: string}>}
   */
  create: async (userData) => {
    const response = await apiService.sendRequest(
      USER_ENDPOINT.CREATE,
      "POST",
      userData
    );
    console.log("User Service Create Response:", response);

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
   * Update user
   * @param {string} id - User ID
   * @param {object} userData - Updated user data
   * @returns {Promise<{success: boolean, data: user, message: string}>}
   */
  update: async (id, userData) => {
    const response = await apiService.sendRequest(
      USER_ENDPOINT.UPDATE(id),
      "PUT",
      userData
    );
    console.log("User Service Update Response:", response);

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
   * Delete user
   * @param {string} id - User ID
   * @returns {Promise<{success: boolean, message: string}>}
   */
  delete: async (id) => {
    const response = await apiService.sendRequest(
      USER_ENDPOINT.DELETE(id),
      "DELETE"
    );
    console.log("User Service Delete Response:", response);

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

export default userService;
