// Get API URL from environment or use default
export const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  // Check if envUrl exists, is not empty, and is not the string "undefined"
  if (
    envUrl &&
    typeof envUrl === "string" &&
    envUrl.trim() !== "" &&
    envUrl !== "undefined"
  ) {
    return envUrl;
  }
  return `http://65.0.106.249:5000/api`;
};

const API_BASE_URL = getApiBaseUrl();

// Debug log to verify the URL is set correctly
console.log("API_BASE_URL:", API_BASE_URL);

if (!import.meta.env.VITE_API_URL || import.meta.env.VITE_API_URL === "undefined") {
  console.warn("VITE_API_URL is not set, using default: http://65.0.106.249:5000/api");
}

class TaskService {
  async getAllTasks() {
    const url = `${API_BASE_URL}/tasks`;
    console.log("Fetching from URL:", url);

    const response = await fetch(url);

    // Check content type to ensure we're getting JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error(
        "Expected JSON but got:",
        contentType,
        "\nResponse:",
        text.substring(0, 200)
      );
      throw new Error(
        `Server returned ${contentType} instead of JSON. Is the server running on port 5000?`
      );
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  async createTask(taskData) {
    const url = `${API_BASE_URL}/tasks`;
    console.log("Creating task at:", url);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  async deleteTask(taskId) {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }
}

export const taskService = new TaskService();
