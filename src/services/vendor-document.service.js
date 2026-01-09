import { mapMessage } from "@/constants/message-mapper";
import apiService from "./api.service";
import { VENDOR_DOCUMENT_ENDPOINT } from "@/constants/api-endpoints";

const vendorDocumentService = {
  /**
   * Get all vendor documents
   * @returns {Promise<{success: boolean, data: vendorDocument[], message: string}>}
   */
  getAll: async () => {
    const response = await apiService.sendRequest(VENDOR_DOCUMENT_ENDPOINT.GET);
    console.log("Vendor Document Service Get All Response:", response);

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
   * Get vendor document by ID
   * @param {string} id
   * @returns {Promise<{success: boolean, data: vendorDocument, message: string}>}
   */
  getById: async (id) => {
    const response = await apiService.sendRequest(VENDOR_DOCUMENT_ENDPOINT.GET_BY_ID(id));
    console.log("Vendor Document Service Get By ID Response:", response);

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
   * Create vendor document
   * @param {object} data
   * @returns {Promise<{success: boolean, data: vendorDocument, message: string}>}
   */
  create: async (data) => {
    const response = await apiService.sendRequest(VENDOR_DOCUMENT_ENDPOINT.CREATE, "POST", data);
    console.log("Vendor Document Service Create Response:", response);

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
   * Update vendor document
   * @param {string} id
   * @param {object} data
   * @returns {Promise<{success: boolean, data: vendorDocument, message: string}>}
   */
  update: async (id, data) => {
    const response = await apiService.sendRequest(VENDOR_DOCUMENT_ENDPOINT.UPDATE(id), "PUT", data);
    console.log("Vendor Document Service Update Response:", response);

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
   * Delete vendor document
   * @param {string} id
   * @returns {Promise<{success: boolean, message: string}>}
   */
  delete: async (id) => {
    const response = await apiService.sendRequest(VENDOR_DOCUMENT_ENDPOINT.DELETE(id), "DELETE");
    console.log("Vendor Document Service Delete Response:", response);

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

export default vendorDocumentService;
