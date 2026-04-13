import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Update this IP to match your machine if it changes
// Android Emulator: "http://10.0.2.2:3000/api"
// Physical device: use your machine's Wi-Fi IP (must be on same network)
const API_URL = "http://192.168.29.191:3000/api";

const client = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token to every request automatically
client.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;
