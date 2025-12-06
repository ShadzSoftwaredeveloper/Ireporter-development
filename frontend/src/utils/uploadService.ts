import { API_ENDPOINTS, getAuthToken } from '../config/api';
import { safeJson } from './safeJson';
import { MediaFile } from '../types';

interface UploadResponse {
  status: string;
  message: string;
  data: {
    files: MediaFile[];
  };
}

/**
 * Upload media files to the server
 * @param files - Array of File objects to upload
 * @returns Promise with uploaded file information
 */
export const uploadMediaFiles = async (files: File[]): Promise<MediaFile[]> => {
  try {
    const formData = new FormData();
    
    // Append all files to FormData
    files.forEach((file) => {
      formData.append('media', file);
    });

    const token = getAuthToken();
    
    const response = await fetch(API_ENDPOINTS.UPLOAD, {
      method: 'POST',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await safeJson(response);
      throw new Error((errorData && errorData.message) || 'Failed to upload files');
    }

    const data: UploadResponse = await safeJson(response);
    return data?.data?.files || [];
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

/**
 * Delete a media file from the server
 * @param filename - Name of the file to delete
 */
export const deleteMediaFile = async (filename: string): Promise<void> => {
  try {
    const token = getAuthToken();
    
    const response = await fetch(API_ENDPOINTS.DELETE_FILE(filename), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      const errorData = await safeJson(response);
      throw new Error((errorData && errorData.message) || 'Failed to delete file');
    }
  } catch (error) {
    console.error('Delete file error:', error);
    throw error;
  }
};

/**
 * Convert a File object to a data URL for preview purposes
 * @param file - File object to convert
 * @returns Promise with data URL string
 */
export const fileToDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
