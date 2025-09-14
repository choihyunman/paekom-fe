export const ICE_CONFIG: RTCConfiguration = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    // { urls: 'turn:YOUR_TURN', username: 'xxx', credential: 'yyy' },
  ],
};
