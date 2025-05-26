import React, { useRef, useState } from "react";
import { DailyProvider } from "@daily-co/daily-react";
import DailyIframe, { DailyCall } from "@daily-co/daily-js";
import VideoBox from "@/app/Components/VideoBox";
import cn from "./utils/TailwindMergeAndClsx";
import IconSparkleLoader from "@/media/IconSparkleLoader";
import "@/styles/global.css"; // Add this if you have a global styles file

interface SimliAgentProps {
  onStart: () => void;
  onClose: () => void;
}



const SimliAgent: React.FC<SimliAgentProps> = ({ onStart, onClose }) => {
  // State management
  const [isLoading, setIsLoading] = useState(false);
  const [isAvatarVisible, setIsAvatarVisible] = useState(false);

  const [tempRoomUrl, setTempRoomUrl] = useState<string>("");
  const [callObject, setCallObject] = useState<DailyCall | null>(null);
  const myCallObjRef = useRef<DailyCall | null>(null);
  const [chatbotId, setChatbotId] = useState<string | null>(null);

  const handleJoinRoom = async () => {
    // Set loading state
    setIsLoading(true);

    const response = await fetch("https://api.simli.ai/session/31ba7e1d-9871-4a0a-89dc-acda31e7a2bc/gAAAAABoNCbWeIaAB7fGtfhyZj14w1yeEijbk1dNzi66PYRMp-AczbUQRetRPthULjeWkRKherMP1bzUeFk7L1tIovoVVIHgUg3jVzbDABxNLX7zw2aYjQg5xl7FSE9D4sH0XwyRHqdvdDsxOLgi0M2j3cc_kqwo1PKoa1Hilpb3V4FvYX6XWYHdl6pub8oCheUkUJF_OPTXFv-MIhK6J968ZOpu4Rxcr-GMkaceAJw9ZVaB8Z6-qsDdiFYPHu6jfjbKibtzl5fIF731oEV_6JO61cbWicgBEzMt2N4RkLzIKOgjOHyTgd6iqd2xYjwzZ1nHA3PD20BNLBCBrqbzN3MF6jcaFgwPrkvYcxrdT5kOqcQB_I4Ynoguq0Jsl-41HAe-TacYnCKyEgFcG7PSYHOhULLbtE-nAg==", {
      method: "GET",
      headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
      },
  })
  
  const data = await response.json();
  const roomUrl = data.roomUrl;

    // Print the API response 
    console.log("API Response", data);

    // Create a new Daily call object
    let newCallObject = DailyIframe.getCallInstance();
    if (newCallObject === undefined) {
      newCallObject = DailyIframe.createCallObject({
        videoSource: false,
      });
    }

    // Setting my default username
    newCallObject.setUserName("User");

    // Join the Daily room
    await newCallObject.join({ url: roomUrl });
    myCallObjRef.current = newCallObject;
    console.log("Joined the room with callObject", newCallObject);
    setCallObject(newCallObject);

    // Start checking if Simli's Chatbot Avatar is available
    loadChatbot();
  };  

  /**
   * Checking if Simli's Chatbot avatar is available then render it
   */
  const loadChatbot = async () => {
    if (myCallObjRef.current) {
      let chatbotFound: boolean = false;

      const participants = myCallObjRef.current.participants();
      for (const [key, participant] of Object.entries(participants)) {
        if (participant.user_name === "Chatbot") {
          setChatbotId(participant.session_id);
          chatbotFound = true;
          setIsLoading(false);
          setIsAvatarVisible(true);
          onStart();
          break; // Stop iteration if you found the Chatbot
        }
      }
      if (!chatbotFound) {
        setTimeout(loadChatbot, 500);
      }
    } else {
      setTimeout(loadChatbot, 500);
    }
  };  

  /**
   * Leave the room
   */
  const handleLeaveRoom = async () => {
    if (callObject) {
      await callObject.leave();
      setCallObject(null);
      onClose();
      setIsAvatarVisible(false);
      setIsLoading(false);
    } else {
      console.log("CallObject is null");
    }
  };

  /**
   * Mute participant audio
   */
  const handleMute = async () => {
    if (callObject) {
      callObject.setLocalAudio(false);
    } else {
      console.log("CallObject is null");
    }
  };

  return (
    <>
      {isAvatarVisible && (
        <div className="h-[350px] w-[350px]">
          <div className="h-[350px] w-[350px]">
            <DailyProvider callObject={callObject}>
              {chatbotId && <VideoBox key={chatbotId} id={chatbotId} />}
            </DailyProvider>
          </div>
        </div>
      )}
      <div className="flex flex-col items-center bg-green-900 min-h-screen p-4 text-white">
        <div className="welcome-message">Welcome to The Laughrapist Experience</div>
        <div className="laughrapist-intro">Meet Dr. Jim Carry — your personal laughrapist. He's here to crack jokes, lift moods, and turn therapy into comedy gold.</div>
        {!isAvatarVisible ? (
          <button
            onClick={handleJoinRoom}
            disabled={isLoading}
            className={cn(
              "w-full h-[52px] mt-4 disabled:bg-[#343434] disabled:text-white disabled:hover:rounded-[100px] bg-simliblue text-white py-3 px-6 rounded-[100px] transition-all duration-300 hover:text-black hover:bg-white hover:rounded-sm",
              "flex justify-center items-center"
            )}
          >
            {isLoading ? (
              <IconSparkleLoader className="h-[20px] animate-loader" />
            ) : (
              <span className="font-abc-repro-mono font-bold w-[164px]">
                Let's Giggle
              </span>
            )}
          </button>
        ) : (
          <>
            <div className="flex items-center gap-4 w-full">
              <button
                onClick={handleLeaveRoom}
                className={cn(
                  "mt-4 group text-white flex-grow bg-red hover:rounded-sm hover:bg-white h-[52px] px-6 rounded-[100px] transition-all duration-300"
                )}
              >
                <span className="font-abc-repro-mono group-hover:text-black font-bold w-[164px] transition-all duration-300">
                  Stop Interaction
                </span>
              </button>
            </div>
          </>
        )}

      </div>
    </>
  );
};

export default SimliAgent;
