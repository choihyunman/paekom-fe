export type Signal =
  | { type: "join"; roomId: string }
  | { type: "offer"; roomId: string; sdp: RTCSessionDescriptionInit }
  | { type: "answer"; roomId: string; sdp: RTCSessionDescriptionInit }
  | { type: "ice"; roomId: string; candidate: RTCIceCandidateInit }
  | { type: "leave"; roomId: string };

export const createSignaling = (
  url: string,
  onMessage: (msg: Signal) => void
) => {
  const ws = new WebSocket(url);
  ws.onmessage = (e) => onMessage(JSON.parse(e.data));
  const send = (msg: Signal) =>
    ws.readyState === WebSocket.OPEN && ws.send(JSON.stringify(msg));
  return { send, close: () => ws.close() };
};
