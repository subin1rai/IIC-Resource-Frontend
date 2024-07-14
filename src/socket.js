import { io } from "socket.io-client";

const URL = "http://localhost:8898";

export const socket = io(URL);
