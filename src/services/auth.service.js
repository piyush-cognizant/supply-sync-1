import { mapMessage } from "@/constants/message-mapper";
import apiService from "./api.service";
import { USER_ENDPOINT } from "@/constants/api-endpoints";

const authService = {
    /* @param {string} email */
    /* @param {string} password */
    /* @returns {success: boolean, data: user, message: string} */
    login: async (email, password) => {
        const response = await apiService.sendRequest(
            USER_ENDPOINT.GET_BY_EMAIL(email)
        );
        console.log("Auth Service Login Response:", response);
        if (response.success && response.data[0].password === password) {
            return {
                success: true,
                data: { user: response.data[0] },
                message: mapMessage("LOGIN_SUCCESS")
            }
        }

        return {
            success: false,
            data: null,
            message: mapMessage("LOGIN_FAILED")
        }
    }
}

export default authService;