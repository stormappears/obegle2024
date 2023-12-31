import { useEffect, useRef, useState } from "react";
import "./../styles/mainarea.css";
import Peer from "peerjs";
import socket from 'socket.io-client'

// const peer = new Peer();

const peerCofig = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};
const peerConnection = new RTCPeerConnection(peerCofig);

function Mainarea() {
    const [peerId, setPeerId] = useState("");
    const [remotePeerIdValue, setRemotePeerIdValue] = useState("");
    const remoteVideoRef = useRef(null);
    const currentUserVideoRef = useRef(null);
    const peerInstance = useRef(null);

    const peer = new Peer();
  
  useEffect(() => {

    peer.on("open", (id) => {
      setPeerId(id);
    });

    peer.on("call", (call) => {
      var getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;

      getUserMedia({ video: true, audio: true }, (mediaStream) => {
        currentUserVideoRef.current.srcObject = mediaStream;
        currentUserVideoRef.current.play();
        call.answer(mediaStream);
        call.on("stream", function (remoteStream) {
          remoteVideoRef.current.srcObject = remoteStream;
          remoteVideoRef.current.play();
        });
      });
    });

    peerInstance.current = peer;
  }, []);

  const call = (remotePeerId) => {
    var getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia;

    getUserMedia({ video: true, audio: true }, (mediaStream) => {
      currentUserVideoRef.current.srcObject = mediaStream;
      currentUserVideoRef.current.play();

      const call = peerInstance.current.call(remotePeerId, mediaStream);

      call.on("stream", (remoteStream) => {
        remoteVideoRef.current.srcObject = remoteStream;
        remoteVideoRef.current.play();
      });
    });
  };



  return (
    <div className="mainarea">
      <div className="mainarea_right">
        <div className="container_remotevideo">
          <video
            ref={remoteVideoRef}
            className="remotevideo"
            autoPlay
            src=""
          ></video>
        </div>
        <div className="container_uservideo">
          <video
            className="uservideo"
            ref={currentUserVideoRef}
            autoPlay
            src=""
          ></video>
        </div>
        <div className="container_funboard">
          <div className="funboard">
            <h1>Current user id is {peerId}</h1>
            
            {/* <div className="funboard_btn_autoskip">Skip</div>
            <div className="funboard_btn_scrshare"></div>
            <div className="funboard_btn_memeboard"></div>
            <div className="funboard_btn_sndboard"></div> */}
          </div>
        </div>
      </div>
      <div className="mainarea_left">
        <div className="chatarea"></div>
        <div className="chat_enter"></div>
      </div>
    </div>
  );
}

export default Mainarea;
