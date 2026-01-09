import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/**
 * Generate credentials based on email
 * @param {string} email - Email address to generate password from
 * @returns {object} - Object with email and generated password
 */
export function generateCredentials(email) {
  // Extract username from email (part before @)
  const username = email.split("@")[0];
  // Generate password: username@123
  const password = `${username}@123`;
  
  return {
    email,
    password,
  };
}

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<void>}
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error("Failed to copy to clipboard:", err);
    return false;
  }
}
