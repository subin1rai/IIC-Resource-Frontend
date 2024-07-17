import { io } from "socket.io-client";

const socket = io("http://localhost:8898");

export default socket;
