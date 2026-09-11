import React from 'react';
import { Bot, Sparkles } from 'lucide-react';

export default function FloatingAIChatTrigger({ onClick }) {
  return (
    <button className="floating-ai-trigger" onClick={onClick} title="Open AI Co-Planner Chat">
      <div className="trigger-pulse-ring"></div>
      <div className="trigger-icon-box">
        <Bot size={22} />
        <Sparkles size={12} className="sparkle-overlay" />
      </div>
      <span className="trigger-label">AI Co-Planner</span>

      <style>{`
        .floating-ai-trigger {
          position: fixed;
          bottom: 28px;
          right: 28px;
          z-index: 990;
          background: linear-gradient(135deg, #0b221d 0%, #173e35 100%);
          border: 1px solid #c4963d;
          border-radius: var(--radius-md, 4px);
          padding: 10px 18px;
          color: #faf3e5;
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(196, 150, 61, 0.3);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .floating-ai-trigger:hover {
          transform: translateY(-4px) scale(1.03);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.7), 0 0 30px rgba(196, 150, 61, 0.5);
          border-color: #dbac4d;
        }

        .trigger-icon-box {
          position: relative;
          color: #c4963d;
          display: flex;
          align-items: center;
        }

        .sparkle-overlay {
          position: absolute;
          top: -4px;
          right: -6px;
          color: #faf3e5;
          animation: sparkleSpin 3s linear infinite;
        }

        @keyframes sparkleSpin {
          from { transform: rotate(0deg) scale(0.8); }
          50% { transform: rotate(180deg) scale(1.2); }
          to { transform: rotate(360deg) scale(0.8); }
        }

        .trigger-label {
          font-family: var(--font-sans);
          font-weight: 800;
          font-size: 0.85rem;
          letter-spacing: 0.02em;
          color: #faf3e5;
        }

        .trigger-pulse-ring {
          position: absolute;
          inset: -4px;
          border-radius: 6px;
          border: 1px solid rgba(196, 150, 61, 0.4);
          animation: pulseRing 2s infinite;
          pointer-events: none;
        }

        @keyframes pulseRing {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(1.15); opacity: 0; }
        }

        @media (max-width: 600px) {
          .floating-ai-trigger {
            bottom: 20px;
            right: 20px;
            padding: 10px 14px;
          }
          .trigger-label {
            display: none;
          }
        }
      `}</style>
    </button>
  );
}
