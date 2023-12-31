import { useEffect, useRef, useState } from "react";
import "./../styles/mainarea.css";

// const peer = new Peer();

function Mainarea() {
  const userVidRef = useRef();

  useEffect(() => {
    
    const stream = navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true,
    });

    stream.then((e) => {
      userVidRef.current.srcObject = e;
    
    });
  }, []);

  return (
    <div className="mainarea">
      <div className="mainarea_right">
        <div className="container_remotevideo">
          <video className="remotevideo" autoPlay src=""></video>
        </div>
        <div className="container_uservideo">
          <video className="uservideo" ref={userVidRef} autoPlay src=""></video>
        </div>
        <div className="container_funboard">
          <div className="funboard">
            <div className="funboard_btn_autoskip">Skip</div>
            <div className="funboard_btn_scrshare"></div>
            <div className="funboard_btn_memeboard"></div>
            <div className="funboard_btn_sndboard"></div>
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
