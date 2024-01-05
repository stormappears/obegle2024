import { useEffect, useRef, useState } from "react";
import "./../styles/mainarea.css";
import Peer from "peerjs";
import io from "socket.io-client";

//asset import
import funBtn1 from "./../assets/buttons/btn1.png";
import funBtn2 from "./../assets/buttons/btn2.png";
import funBtn3 from "./../assets/buttons/btn3.png";
import funBtn4 from "./../assets/buttons/btn4.png";

//socket io connection
const socket = io("https://nodeobegle.onrender.com/");

//// esablish new peer instance here we generate our id
const peer = new Peer();

function Mainarea() {
  // states and refs for socket io
  const [room, setRoom] = useState(" ");

  // states and refs for peer js
  // const [peerId, setPeerId] = useState("");
  // const [remotePeerIdValue, setRemotePeerIdValue] = useState("");
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


  //function for handling chat  box input changes

  const handleChatInput = (e) => {
    console.log(e.target.value);
  }

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
            <div onClick={handleNextClick} className="funboard_btn_autoskip">
              <img src={funBtn1} alt="" />
            </div>
            <div className="funboard_btn_scrshare">
              <img src={funBtn2} alt="" />
            </div>
            <div className="funboard_btn_memeboard">
              <img src={funBtn3} alt="" />
            </div>
            <div className="funboard_btn_sndboard">
              <img src={funBtn4} alt="" />
            </div>
          </div>
        </div>
      </div>
      <div className="mainarea_left">
        <div className="chatarea">
          <div className="chatview"></div>
        </div>
        <div className="chat_enter_area">
          <div className="chattype">
            <input type="text" onChange={handleChatInput} />
            <button className="btn_sendchat">      </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Mainarea;
