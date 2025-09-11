import React, { useEffect, useRef } from "react";

const WebRTCApp: React.FC = () => {
  const ws = useRef<WebSocket | null>(null);
  const pc = useRef<RTCPeerConnection | null>(null);
  const localVideo = useRef<HTMLVideoElement | null>(null);
  const remoteVideo = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    // 1. WebSocket 연결
    ws.current = new WebSocket("ws://localhost:8080/ws/signaling");

    ws.current.onopen = () => {
      console.log("✅ WebSocket connected");

      // 2. PeerConnection 생성 (STUN 서버 설정)
      pc.current = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      // 3. 내 ICE 후보가 생기면 서버에 전송
      pc.current.onicecandidate = (event) => {
        if (event.candidate) {
          ws.current?.send(
            JSON.stringify({
              type: "ice",
              roomId: "room1",
              candidate: event.candidate,
            })
          );
        }
      };

      // 4. 상대방 트랙 수신 → remoteVideo에 표시
      pc.current.ontrack = (event) => {
        if (remoteVideo.current) {
          remoteVideo.current.srcObject = event.streams[0];
        }
      };

      // 5. 내 로컬 미디어 가져오기
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          if (localVideo.current) {
            localVideo.current.srcObject = stream;
          }
          stream.getTracks().forEach((track) => {
            pc.current?.addTrack(track, stream);
          });

          // 방에 참가
          ws.current?.send(JSON.stringify({ type: "join", roomId: "room1" }));

          // Offer 생성 → 서버 전송
          pc.current?.createOffer().then((offer) => {
            pc.current?.setLocalDescription(offer);
            ws.current?.send(
              JSON.stringify({ type: "offer", roomId: "room1", sdp: offer })
            );
          });
        });
    };

    // 6. WebSocket에서 signaling 메시지 받기
    ws.current.onmessage = async (event) => {
      const msg = JSON.parse(event.data);
      console.log("📩 Received:", msg);

      if (msg.type === "offer") {
        await pc.current?.setRemoteDescription(
          new RTCSessionDescription(msg.sdp)
        );
        const answer = await pc.current?.createAnswer();
        await pc.current?.setLocalDescription(answer);
        ws.current?.send(
          JSON.stringify({ type: "answer", roomId: "room1", sdp: answer })
        );
      }

      if (msg.type === "answer") {
        await pc.current?.setRemoteDescription(
          new RTCSessionDescription(msg.sdp)
        );
      }

      if (msg.type === "ice" && msg.candidate) {
        try {
          await pc.current?.addIceCandidate(new RTCIceCandidate(msg.candidate));
        } catch (err) {
          console.error("ICE error:", err);
        }
      }
    };

    return () => {
      ws.current?.close();
      pc.current?.close();
    };
  }, []);

  return (
    <div style={{ display: "flex", gap: 20, padding: 20 }}>
      <div>
        <h3>내 화면</h3>
        <video
          ref={localVideo}
          autoPlay
          playsInline
          muted
          style={{ width: 300, background: "#000" }}
        />
      </div>
      <div>
        <h3>상대 화면</h3>
        <video
          ref={remoteVideo}
          autoPlay
          playsInline
          style={{ width: 300, background: "#000" }}
        />
      </div>
    </div>
  );
};

export default WebRTCApp;
