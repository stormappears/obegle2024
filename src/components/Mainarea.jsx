import { useEffect, useRef, useState } from "react";
import "./../styles/mainarea.css";
import Peer from "peerjs";
import io from "socket.io-client";

//socket io connection
const socket = io("http://localhost:3001/");

//// esablish new peer instance here we generate our id
const peer = new Peer();


function Mainarea() {
  // states and refs for socket io
  const [room, setRoom] = useState(" ");

  // states and refs for peer js
  const [peerId, setPeerId] = useState("");
  const [remotePeerIdValue, setRemotePeerIdValue] = useState("");
  const remoteVideoRef = useRef(null);
  const currentUserVideoRef = useRef(null);
  const peerInstance = useRef(null);

  let keyrecived = false;

  socket.io.on("ping", () => {
    // ...
  });

  function handleNextClick() {
    window.location.reload(false);
    socket.on("disconnect", (reason) => {
      console.log(reason);
    });

    socket.on("connect", () => {
      // ...
    });
  }

  useEffect(() => {
    socket.on("sendUserRoom", (data) => {
      setRoom(data);
      joinRoom();
    });

    socket.on("peer_reciver", (data) => {
      call(data.id);
      console.log("remote id :" + data.id);
      // if (data.id.lenghth == 36) {
      //   keyrecived = true;
      //   console.log(data.id);
      //     call(data.id);
      // }
    });
  }, [socket]);

  function joinRoom() {
    if (room !== "") {
      socket.emit("join_room", room);
    }
  }

  //Generate and set peer id
  peer.on("open", (id) => {
    if (keyrecived == false) {
      socket.emit("peerid", { id, room });
    } else {
      console.log("key already recived");
    }
  });

  useEffect(() => {
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
