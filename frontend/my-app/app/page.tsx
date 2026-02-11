"use client";
import { useState, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [profile, setProfile] = useState("");
  const [job, setJob] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [chat, setChat] = useState<any[]>([]);
  const [recording, setRecording] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const BACKEND = "https://intercept-backend-06zy.onrender.com";




  // CAMERA
 const startCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });

    console.log("Camera stream:", stream);

    setCameraOn(true);

    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch((e) => console.log("play error", e));
        };
      }
    }, 500);

  } catch (err) {
    console.error("CAMERA ERROR:", err);
    alert("Camera access denied or not supported");
  }
};



  const playAudio = (url: string) => {
    const audio = new Audio(`${BACKEND}${url}`);
    audio.play().catch(console.error);
  };

  // START SESSION
  const startInterview = async () => {
    if (!profile.trim() || !job.trim()) {
      alert("Please complete profile and job role");
      return;
    }

    if (!apiKey.trim()) {
      alert("Enter Gemini API key");
      return;
    }

    await startCamera();

    try {
      const form = new FormData();
      form.append("profile", profile);
      form.append("job", job);
      form.append("api_key", apiKey);

      const res = await axios.post(`${BACKEND}/start`, form);

      setSessionId(res.data.session_id);
      setChat([{ role: "ai", text: res.data.text, audio: res.data.audio }]);
      playAudio(res.data.audio);
    } catch (err) {
      alert("Failed to connect backend");
      console.error(err);
    }
  };

  // SPEECH INPUT
  const startRecording = () => {
    const SpeechRecognition =
      window.SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice input not supported in browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();
    setRecording(true);

    recognition.onresult = async (event: any) => {
      const text = event.results[0][0].transcript.trim();
      setRecording(false);

      try {
        const form = new FormData();
        form.append("session_id", sessionId);
        form.append("text", text);

        const res = await axios.post(`${BACKEND}/text`, form);

        setChat((prev) => [
          ...prev,
          { role: "user", text },
          { role: "ai", text: res.data.ai_text },
        ]);

        if (res.data.audio) playAudio(res.data.audio);
      } catch (err) {
        console.error("Voice send failed", err);
      }
    };

    recognition.onerror = () => setRecording(false);
    recognition.onend = () => setRecording(false);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      <div className="container mx-auto px-6 py-12 max-w-6xl">

        {/* TITLE */}
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl font-bold text-center mb-14"
        >
          Intercept
        </motion.h1>

        {/* INPUT */}
        <AnimatePresence>
          {!sessionId && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-xl mx-auto bg-white/5 border border-white/10 rounded-3xl p-10"
            >
              <div className="space-y-6">

                <input
                  placeholder="Professional identity"
                  value={profile}
                  onChange={(e) => setProfile(e.target.value)}
                  className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-xl"
                />

                <input
                  placeholder="Target role / position"
                  value={job}
                  onChange={(e) => setJob(e.target.value)}
                  className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-xl"
                />

                <input
                  placeholder="Enter Gemini API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-xl"
                />

                <button
                  onClick={startInterview}
                  className="w-full py-5 bg-white/10 hover:bg-white/20 rounded-full text-lg font-semibold"
                >
                  INITIATE SESSION
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SESSION */}
        {sessionId && (
          <div className="grid md:grid-cols-2 gap-10 mt-12">

            {/* VIDEO */}
            {cameraOn && (
              <div className="rounded-3xl overflow-hidden border border-white/10">
                <video
  ref={videoRef}
  autoPlay
  muted
  playsInline
  className="w-full h-full object-cover"
  style={{ background: "black" }}
/>

              </div>
            )}

            {/* CHAT */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 h-[600px] flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-4">
                {chat.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "ai" ? "justify-start" : "justify-end"}`}>
                    <div className="bg-white/10 px-5 py-3 rounded-xl max-w-[80%]">
                      <b>{msg.role === "ai" ? "AI" : "You"}:</b> {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* MIC */}
              <div className="mt-6 flex justify-center">
                <button
                  onClick={startRecording}
                  className="px-12 py-5 bg-white/10 rounded-full text-xl"
                >
                  {recording ? "Listening..." : "🎤 Speak"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
