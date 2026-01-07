export const MESSAGE_MAPPER = {
    SERVER_ERROR: "A server error occurred. Please try again later.",
    INVALID_CREDENTIALS: "The provided credentials are invalid. Please check and try again.",
    USER_NOT_FOUND: "No user found with the provided information.",
    ACCESS_DENIED: "You do not have permission to access this resource.",
    VALIDATION_ERROR: "There was a validation error with your request. Please check the input data.",
    LOGIN_SUCCESS: "Login successful. Welcome back!",
    LOGIN_FAILED: "Login failed. Please check your email and password.",
    FETCH_SUCCESS: "Data fetched successfully.",
    CREATE_SUCCESS: "Created successfully.",
    UPDATE_SUCCESS: "Updated successfully.",
    DELETE_SUCCESS: "Deleted successfully.",
}

export const mapMessage = (code) => {
    return MESSAGE_MAPPER[code] || code || 'An unexpected error occurred.'
}