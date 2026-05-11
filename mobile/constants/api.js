import Constants from "expo-constants";

// Tự động lấy IP của máy tính đang chạy Expo (Host IP)
const getHostIp = () => {
  const hostUri = Constants.expoConfig?.hostUri;
  if (!hostUri) return "localhost";
  return hostUri.split(":")[0];
};

const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || `http://${getHostIp()}:5001`;

export const API_URL = `${BASE_URL}/api`;
