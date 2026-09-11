import React, { useEffect, useRef, useState } from 'react';
import { Plane, Train, Hotel, Compass, Ticket, Sparkles } from 'lucide-react';

export default function Background3D() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 2; // -1 to 1
      const y = (e.clientY / innerHeight - 0.5) * 2;
      setMouseOffset({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle nodes for flowing wave
    const numParticles = Math.min(55, Math.floor(width / 24));
    const particles = [];

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 1,
        color: i % 3 === 0 ? 'rgba(196, 150, 61, ' : 'rgba(255, 255, 255, ',
        baseAlpha: Math.random() * 0.4 + 0.2,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        pulseOffset: Math.random() * Math.PI * 2
      });
    }

    let step = 0;

    const render = () => {
      step += 0.012;
      ctx.clearRect(0, 0, width, height);

      // 1. Draw flowing wave curves behind
      ctx.save();
      ctx.lineWidth = 1.4;
      
      // Wave 1 - Gold Light Wave
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(196, 150, 61, 0.16)';
      for (let x = 0; x <= width; x += 20) {
        const y = Math.sin(x * 0.003 + step) * 45 + Math.cos(x * 0.001 + step * 0.7) * 25 + height * 0.45;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Wave 2 - Teal Cyan Wave
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(37, 180, 140, 0.14)';
      for (let x = 0; x <= width; x += 20) {
        const y = Math.sin(x * 0.004 - step * 0.8) * 55 + Math.sin(x * 0.002 + step * 1.2) * 35 + height * 0.55;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();

      // 2. Draw & connect particle nodes
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const currentAlpha = p.baseAlpha + Math.sin(step * 2 + p.pulseOffset) * 0.15;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${Math.max(0.1, currentAlpha)})`;
        ctx.fill();

        // Connect nearby particles with subtle lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(196, 150, 61, ${0.12 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }

      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="background-3d-wrapper" ref={containerRef}>
      {/* Dynamic 2D/3D Canvas Wave & Particles */}
      <canvas ref={canvasRef} className="particles-canvas" />

      {/* Radial Light Pulses */}
      <div 
        className="radial-light-pulse pulse-1" 
        style={{ transform: `translate3d(${mouseOffset.x * 20}px, ${mouseOffset.y * 20}px, 0)` }}
      />
      <div 
        className="radial-light-pulse pulse-2" 
        style={{ transform: `translate3d(${-mouseOffset.x * 25}px, ${-mouseOffset.y * 25}px, 0)` }}
      />

      {/* Floating 3D Orbiting Travel Glass Badges */}
      <div 
        className="orbiting-icons-container"
        style={{
          transform: `perspective(1200px) rotateY(${mouseOffset.x * 5}deg) rotateX(${-mouseOffset.y * 5}deg)`
        }}
      >
        <div className="orbit-glass-badge badge-plane" title="Non-Stop Flights">
          <div className="badge-icon-wrap"><Plane size={15} /></div>
          <span className="badge-text">NON-STOP AIR</span>
        </div>

        <div className="orbit-glass-badge badge-train" title="High-Speed Rail">
          <div className="badge-icon-wrap"><Train size={15} /></div>
          <span className="badge-text">VANDE BHARAT 160KM/H</span>
        </div>

        <div className="orbit-glass-badge badge-hotel" title="Boutique Stays & Havelis">
          <div className="badge-icon-wrap"><Hotel size={15} /></div>
          <span className="badge-text">5★ BOUTIQUE HAVELIS</span>
        </div>

        <div className="orbit-glass-badge badge-compass" title="Autonomous Routing">
          <div className="badge-icon-wrap"><Compass size={15} /></div>
          <span className="badge-text">SMART TRANSIT BUFFERS</span>
        </div>

        <div className="orbit-glass-badge badge-ticket" title="Zero Markup Direct Bookings">
          <div className="badge-icon-wrap"><Ticket size={15} /></div>
          <span className="badge-text">ZERO MARKUP FARES</span>
        </div>

        <div className="orbit-glass-badge badge-sparkles" title="AI Co-Planner 3.0">
          <div className="badge-icon-wrap"><Sparkles size={15} /></div>
          <span className="badge-text">AI CO-PLANNER 3.0</span>
        </div>
      </div>

      <style>{`
        .background-3d-wrapper {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: 1;
        }

        .particles-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }

        /* Radial Light Pulses */
        .radial-light-pulse {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.35;
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          animation: pulseGlow 6s ease-in-out infinite alternate;
        }

        .pulse-1 {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(196, 150, 61, 0.45) 0%, rgba(15, 44, 37, 0) 70%);
          top: 10%;
          left: 15%;
        }

        .pulse-2 {
          width: 650px;
          height: 650px;
          background: radial-gradient(circle, rgba(37, 180, 140, 0.35) 0%, rgba(11, 34, 29, 0) 70%);
          bottom: 5%;
          right: 10%;
          animation-delay: -3s;
        }

        @keyframes pulseGlow {
          0% { transform: scale(0.9) translateY(0); opacity: 0.25; }
          100% { transform: scale(1.15) translateY(-20px); opacity: 0.45; }
        }

        /* Orbiting 3D Floating Glass Badges */
        .orbiting-icons-container {
          position: absolute;
          inset: 0;
          perspective: 1200px;
          transform-style: preserve-3d;
          transition: transform 0.15s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .orbit-glass-badge {
          position: absolute;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          background: rgba(11, 34, 29, 0.68);
          border: 1px solid rgba(196, 150, 61, 0.45);
          border-radius: var(--radius-md, 4px);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6), 0 0 18px rgba(196, 150, 61, 0.25);
          color: #faf3e5;
          user-select: none;
          transition: all 0.3s ease;
        }

        .badge-icon-wrap {
          width: 26px;
          height: 26px;
          border-radius: 4px;
          background: rgba(196, 150, 61, 0.2);
          border: 1px solid rgba(196, 150, 61, 0.5);
          display: grid;
          place-items: center;
          color: #c4963d;
        }

        .badge-text {
          font-family: var(--font-sans);
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: #faf3e5;
          white-space: nowrap;
        }

        .badge-plane {
          top: 14%;
          left: 5%;
          animation: float3DPlane 14s ease-in-out infinite alternate;
        }

        .badge-train {
          bottom: 16%;
          left: 6%;
          animation: float3DTrain 16s ease-in-out infinite alternate;
        }

        .badge-hotel {
          top: 18%;
          right: 5%;
          animation: float3DHotel 15s ease-in-out infinite alternate;
        }

        .badge-compass {
          bottom: 20%;
          right: 6%;
          animation: float3DCompass 18s ease-in-out infinite alternate;
        }

        .badge-ticket {
          top: 52%;
          left: 2%;
          animation: float3DTicket 13s ease-in-out infinite alternate;
        }

        .badge-sparkles {
          top: 56%;
          right: 3%;
          animation: float3DSparkles 12s ease-in-out infinite alternate;
        }

        @keyframes float3DPlane {
          0% { transform: translate3d(0, 0, 0) rotate(2deg); }
          50% { transform: translate3d(24px, -30px, 60px) rotate(6deg); }
          100% { transform: translate3d(45px, -15px, 10px) rotate(0deg); }
        }

        @keyframes float3DTrain {
          0% { transform: translate3d(0, 0, 0) rotate(-2deg); }
          50% { transform: translate3d(30px, -24px, 50px) rotate(4deg); }
          100% { transform: translate3d(10px, -45px, 0) rotate(-1deg); }
        }

        @keyframes float3DHotel {
          0% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(-25px, 25px, 60px) rotate(-3deg); }
          100% { transform: translate3d(-10px, -10px, 0); }
        }

        @keyframes float3DCompass {
          0% { transform: translate3d(0, 0, 0) rotate(0deg); }
          50% { transform: translate3d(-30px, -25px, 70px) rotate(5deg); }
          100% { transform: translate3d(-10px, 15px, 0) rotate(-4deg); }
        }

        @keyframes float3DTicket {
          0% { transform: translate3d(0, 0, 0) rotate(-4deg); }
          100% { transform: translate3d(20px, -25px, 40px) rotate(4deg); }
        }

        @keyframes float3DSparkles {
          0% { transform: translate3d(0, 0, 0) scale(0.95); }
          100% { transform: translate3d(-20px, -30px, 50px) scale(1.05); }
        }

        @media (max-width: 1024px) {
          .badge-ticket, .badge-sparkles {
            display: none;
          }
        }

        @media (max-width: 768px) {
          .orbit-glass-badge {
            padding: 6px 10px;
          }
          .badge-text {
            display: none;
          }
          .pulse-1, .pulse-2 {
            width: 300px;
            height: 300px;
          }
        }
      `}</style>
    </div>
  );
}
