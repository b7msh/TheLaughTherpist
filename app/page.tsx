"use client";
import React, { useEffect, useState } from "react";
import SimliAgent from "./SimliAgent";
import DottedFace from "./Components/DottedFace";
import Navbar from "./Components/Navbar";
import Image from "next/image";
import GitHubLogo from "@/media/github-mark-white.svg";

interface FloatingElement {
  size: number;
  x: number;
  y: number;
  color: string;
}

const Demo: React.FC = () => {
  const [showDottedFace, setShowDottedFace] = useState(true);
  const [floatingElements, setFloatingElements] = useState<FloatingElement[]>([]);
  const [showFeatures, setShowFeatures] = useState(false);

  useEffect(() => {
    // Create floating elements
    const createFloatingElements = () => {
      const elements = [];
      for (let i = 0; i < 8; i++) {
        const size = Math.random() * 30 + 20;
        const x = Math.random() * (window.innerWidth - 50);
        const y = Math.random() * (window.innerHeight - 50);
        elements.push({
          size: size,
          x: x,
          y: y,
          color: `hsl(${Math.random() * 120}, 100%, 50%)`, // Limited to green spectrum
        });
      }
      setFloatingElements(elements);
    };

    createFloatingElements();
    window.addEventListener('resize', createFloatingElements);

    // Show features after initial load
    setTimeout(() => setShowFeatures(true), 1000);

    return () => {
      window.removeEventListener('resize', createFloatingElements);
    };
  }, []);

  const onStart = () => {
    console.log("Setting setshowDottedface to false...");
    setShowDottedFace(false);
  };

  const onClose = () => {
    console.log("Setting setshowDottedface to true...");
    setShowDottedFace(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center font-abc-repro font-normal text-sm text-white p-8 relative overflow-hidden">
      {/* Floating elements */}
      {floatingElements.map((el, index) => (
        <div
          key={index}
          className="floating-element"
          style={{
            width: el.size,
            height: el.size,
            backgroundColor: el.color,
            borderRadius: '50%',
            left: el.x,
            top: el.y,
          }}
        />
      ))}

      <Navbar />

      <div className="absolute top-[32px] left-[32px]">
        <div className="flex flex-col gap-2">
          <button
            onClick={() => {
              window.open("https://x.com/TheLaughrapist/with_replies");
            }}
            className="button text-sm px-4 py-2"
          >
            <span className="mr-2">🐦</span> Twitter
          </button>
          <button
            onClick={() => {
              window.open("https://web.telegram.org/k/#@TheLaughrapistbot");
            }}
            className="button text-sm px-4 py-2"
          >
            <span className="mr-2">📱</span> Telegram
          </button>
        </div>
      </div>

      <div className="absolute top-[32px] right-[32px]">
        <button
          onClick={() => {
            window.open("https://github.com/simliai/create-simli-agent");
          }}
          className="button text-sm px-4 py-2"
        >
          <span className="mr-2">⭐</span> GitHub
        </button>
      </div>

      <div className="w-full max-w-5xl mt-20 px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            Welcome to LaughTherapist
          </h1>
          <p className="text-xl text-center mb-8 max-w-2xl mx-auto">
            Your friendly AI therapist that helps you manage stress through laughter and positivity.
          </p>
          <button onClick={onStart} className="button text-xl">
            Start Session
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
          {showFeatures && [
            {
              title: "Laughter Therapy",
              description: "Experience therapeutic laughter exercises to reduce stress and anxiety.",
              icon: "😄",
            },
            {
              title: "Positive Thinking",
              description: "Learn to reframe negative thoughts into positive ones.",
              icon: "😊",
            },
            {
              title: "Stress Relief",
              description: "Discover laughter techniques to help manage daily stress.",
              icon: "😌",
            },
            {
              title: "Mental Wellness",
              description: "Improve your mental health through laughter and positivity.",
              icon: "✨",
            },
          ].map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-bold mb-2">{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl p-10 mb-16">
          <h2 className="text-3xl font-bold mb-6">How it Works</h2>
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">1</div>
              <div>
                <h3 className="font-semibold">Share Your Feelings</h3>
                <p>Talk about what's been bothering you or making you stressed.</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-4xl">2</div>
              <div>
                <h3 className="font-semibold">Find the Funny Side</h3>
                <p>LaughTherapist will help you find humor in the situation.</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-4xl">3</div>
              <div>
                <h3 className="font-semibold">Feel Better</h3>
                <p>Experience stress relief through laughter and positive thinking.</p>
              </div>
            </div>
          </div>
          <button onClick={onStart} className="button mt-6">
            Start Laughing
          </button>
        </div>

        {showDottedFace ? (
          <DottedFace onStart={onStart} />
        ) : (
          <SimliAgent onClose={onClose} />
        )}
      </div>
    </div>
  );
};

export default Demo;
