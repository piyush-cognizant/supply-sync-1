/**
 * File Upload Service (Mock)
 * In production, this would upload files to a storage service like S3, Azure Blob, etc.
 * Currently returns a mock URL for demonstration purposes.
 */

const MOCK_FILE_URL = "https://morth.nic.in/sites/default/files/dd12-13_0.pdf";

const fileUploadService = {
  /**
   * Upload a file and return the URL
   * @param {File} file - The file to upload
   * @returns {Promise<{success: boolean, url: string, message: string}>}
   */
  upload: async (file) => {
    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // In a real implementation, you would:
    // 1. Create a FormData object
    // 2. Append the file
    // 3. Send to your upload endpoint
    // 4. Return the actual URL from the response

    console.log("File Upload Service - Uploading file:", file?.name);

    // Mock successful upload
    return {
      success: true,
      url: MOCK_FILE_URL,
      fileName: file?.name || "uploaded_file.pdf",
      fileType: file?.type || "application/pdf",
      message: "File uploaded successfully",
    };
  },

  /**
   * Upload multiple files
   * @param {File[]} files - Array of files to upload
   * @returns {Promise<{success: boolean, urls: string[], message: string}>}
   */
  uploadMultiple: async (files) => {
    const results = [];

    for (const file of files) {
      const result = await fileUploadService.upload(file);
      if (result.success) {
        results.push({
          url: result.url,
          fileName: result.fileName,
          fileType: result.fileType,
        });
      }
    }

    return {
      success: results.length === files.length,
      files: results,
      message:
        results.length === files.length
          ? "All files uploaded successfully"
          : "Some files failed to upload",
    };
  },

  /**
   * Delete a file by URL
   * @param {string} url - The URL of the file to delete
   * @returns {Promise<{success: boolean, message: string}>}
   */
  delete: async (url) => {
    // Simulate delete delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    console.log("File Upload Service - Deleting file:", url);

    return {
      success: true,
      message: "File deleted successfully",
    };
  },
};

export default fileUploadService;
