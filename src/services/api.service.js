import { mapMessage } from "@/constants/message-mapper";
import axios from "axios";

class ApiService {
    constructor() {
        this.api = axios.create();
        this.api.defaults.headers.common["Content-Type"] = "application/json";
    }

    async sendRequest(endpoint, method = "GET", data = null, headers = {}) {
        const config = {
            url: endpoint,
            method: method,
        };

        if (Object.keys(headers).length) {
            config.headers = headers;
        }

        if (data) {
            config.data = data;
        }

        try {
            const response = await this.api.request(config);
            console.log("API Service Response:", response);
            return {
                status: response.status,
                success: response.status >= 200 && response.status < 300,
                data: response.data,
                message: response.data?.message || null,
                error: null,
            }
        } catch (error) {
            if (error.response) {
                return {
                    status: error.response.status,
                    success: false,
                    data: null,
                    message: error.response.data?.message || null,
                    error,
                }
            } else {
                return {
                    status: 500,
                    success: false,
                    data: null,
                    message: mapMessage("SERVER_ERROR"),
                    error,
                }
            }
        }

    }

}

const apiService = new ApiService();

export default apiService;