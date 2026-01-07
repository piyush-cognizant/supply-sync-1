import { mapMessage } from "@/constants/message-mapper";
import apiService from "./api.service";
import { VENDOR_ENDPOINT } from "@/constants/api-endpoints";

const vendorService = {
    /* @returns {success: boolean, data: vendors[], message: string} */
    getAll: async () => {
        const response = await apiService.sendRequest(VENDOR_ENDPOINT.GET);
        console.log("Vendor Service Get All Response:", response);

        if (response.success) {
            return {
                success: true,
                data: response.data,
                message: mapMessage("FETCH_SUCCESS")
            }
        }

        return {
            success: false,
            data: null,
            message: mapMessage("SERVER_ERROR")
        }
    },

    /* @param {string} id */
    /* @returns {success: boolean, data: vendor, message: string} */
    getById: async (id) => {
        const response = await apiService.sendRequest(VENDOR_ENDPOINT.GET_BY_ID(id));
        console.log("Vendor Service Get By ID Response:", response);

        if (response.success) {
            return {
                success: true,
                data: response.data[0],
                message: mapMessage("FETCH_SUCCESS")
            }
        }

        return {
            success: false,
            data: null,
            message: mapMessage("SERVER_ERROR")
        }
    },

    /* @param {object} vendorData */
    /* @returns {success: boolean, data: vendor, message: string} */
    create: async (vendorData) => {
        const response = await apiService.sendRequest(
            VENDOR_ENDPOINT.CREATE,
            "POST",
            vendorData
        );
        console.log("Vendor Service Create Response:", response);

        if (response.success) {
            return {
                success: true,
                data: response.data,
                message: mapMessage("CREATE_SUCCESS")
            }
        }

        return {
            success: false,
            data: null,
            message: mapMessage("SERVER_ERROR")
        }
    },

    /* @param {string} id */
    /* @param {object} vendorData */
    /* @returns {success: boolean, data: vendor, message: string} */
    update: async (id, vendorData) => {
        const response = await apiService.sendRequest(
            VENDOR_ENDPOINT.UPDATE(id),
            "PUT",
            vendorData
        );
        console.log("Vendor Service Update Response:", response);

        if (response.success) {
            return {
                success: true,
                data: response.data,
                message: mapMessage("UPDATE_SUCCESS")
            }
        }

        return {
            success: false,
            data: null,
            message: mapMessage("SERVER_ERROR")
        }
    },

    /* @param {string} id */
    /* @returns {success: boolean, message: string} */
    delete: async (id) => {
        const response = await apiService.sendRequest(
            VENDOR_ENDPOINT.DELETE(id),
            "DELETE"
        );
        console.log("Vendor Service Delete Response:", response);

        if (response.success) {
            return {
                success: true,
                message: mapMessage("DELETE_SUCCESS")
            }
        }

        return {
            success: false,
            message: mapMessage("SERVER_ERROR")
        }
    }
}

export default vendorService;