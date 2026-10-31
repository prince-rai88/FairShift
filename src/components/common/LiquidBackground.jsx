import React, { useEffect, useRef } from 'react';

/**
 * LiquidBackground — High-performance 3D fluid aurora canvas
 * Features:
 * - Fluid harmonic multi-sine plasma orbs
 * - 3D mouse parallax tracking with spring interpolation
 * - Cosmic stardust particles floating through depth planes
 * - Multi-layer spectral blending behind frosted glass cards
 */
export default function LiquidBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse coordinates with smooth spring interpolation
    let mouse = {
      x: width * 0.5,
      y: height * 0.4,
      targetX: width * 0.5,
      targetY: height * 0.4,
    };

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        mouse.targetX = e.touches[0].clientX;
        mouse.targetY = e.touches[0].clientY;
      }
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('resize', handleResize);

    // Fluid Aurora Orbs in 3D Depth Layers
    const orbs = [
      {
        // 1. Electric Cyan Aurora
        baseX: width * 0.2,
        baseY: height * 0.25,
        radius: Math.min(width, height) * 0.38,
        color: 'rgba(6, 182, 212,',
        phaseX: 0,
        phaseY: 1.5,
        speedX: 0.0006,
        speedY: 0.0008,
        zDepth: 1.35, // Strong parallax
        pulseSpeed: 0.0012,
      },
      {
        // 2. Royal Blue Core
        baseX: width * 0.8,
        baseY: height * 0.35,
        radius: Math.min(width, height) * 0.44,
        color: 'rgba(37, 99, 235,',
        phaseX: 2.1,
        phaseY: 0.4,
        speedX: 0.0005,
        speedY: 0.0007,
        zDepth: 0.85, // Mid-ground
        pulseSpeed: 0.0009,
      },
      {
        // 3. Deep Violet / Cosmic Indigo
        baseX: width * 0.35,
        baseY: height * 0.8,
        radius: Math.min(width, height) * 0.42,
        color: 'rgba(124, 58, 237,',
        phaseX: 4.2,
        phaseY: 3.1,
        speedX: 0.0007,
        speedY: 0.0005,
        zDepth: 0.6, // Deep background
        pulseSpeed: 0.0011,
      },
      {
        // 4. Emerald / SDG 8 Teal
        baseX: width * 0.85,
        baseY: height * 0.85,
        radius: Math.min(width, height) * 0.32,
        color: 'rgba(16, 185, 129,',
        phaseX: 1.1,
        phaseY: 2.8,
        speedX: 0.0008,
        speedY: 0.0009,
        zDepth: 1.1, // Foreground accent
        pulseSpeed: 0.0015,
      },
      {
        // 5. Prismatic Sky Blue Highlight (Tracks close to cursor)
        baseX: width * 0.5,
        baseY: height * 0.5,
        radius: Math.min(width, height) * 0.28,
        color: 'rgba(56, 189, 248,',
        phaseX: 3.4,
        phaseY: 1.2,
        speedX: 0.001,
        speedY: 0.0012,
        zDepth: 1.8, // Closest foreground layer
        pulseSpeed: 0.0018,
      },
    ];

    // Cosmic stardust depth particles
    const particleCount = 42;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.8,
      speedY: Math.random() * 0.3 + 0.1,
      alpha: Math.random() * 0.6 + 0.2,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.02 + 0.01,
      z: Math.random() * 1.5 + 0.5,
    }));

    let time = 0;

    const render = () => {
      time += 1;

      // Smooth mouse interpolation (spring damping)
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      const normMouseX = (mouse.x / width - 0.5) * 2;
      const normMouseY = (mouse.y / height - 0.5) * 2;

      // Clear Canvas
      ctx.clearRect(0, 0, width, height);

      // Deep Space Base
      ctx.fillStyle = '#060B18';
      ctx.fillRect(0, 0, width, height);

      // Enable spectral additive blending for liquid light
      ctx.globalCompositeOperation = 'screen';

      // Render Fluid Aurora Orbs
      orbs.forEach((orb) => {
        // Multi-frequency harmonic liquid drift
        const harmonicX =
          Math.sin(time * orb.speedX + orb.phaseX) * (width * 0.12) +
          Math.cos(time * orb.speedY * 0.5) * (width * 0.05);

        const harmonicY =
          Math.cos(time * orb.speedY + orb.phaseY) * (height * 0.1) +
          Math.sin(time * orb.speedX * 0.7) * (height * 0.04);

        // 3D Parallax offset based on mouse distance and zDepth
        const parallaxX = normMouseX * 55 * orb.zDepth;
        const parallaxY = normMouseY * 45 * orb.zDepth;

        const currentX = orb.baseX + harmonicX + parallaxX;
        const currentY = orb.baseY + harmonicY + parallaxY;

        // Organic breathing expansion
        const pulse = 1 + Math.sin(time * orb.pulseSpeed) * 0.12;
        const currentRadius = Math.max(100, orb.radius * pulse);

        // Volumetric radial plasma gradient
        const gradient = ctx.createRadialGradient(
          currentX,
          currentY,
          currentRadius * 0.05,
          currentX,
          currentY,
          currentRadius
        );

        gradient.addColorStop(0, `${orb.color} 0.55)`);
        gradient.addColorStop(0.3, `${orb.color} 0.35)`);
        gradient.addColorStop(0.65, `${orb.color} 0.12)`);
        gradient.addColorStop(1, `${orb.color} 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(currentX, currentY, currentRadius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Render Cosmic Stardust Particles in 3D Depth
      ctx.globalCompositeOperation = 'lighter';
      particles.forEach((p) => {
        p.y -= p.speedY;
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }

        p.pulse += p.pulseSpeed;
        const currentAlpha = p.alpha * (0.6 + Math.sin(p.pulse) * 0.4);

        // Parallax shift for particles
        const particleX = p.x + normMouseX * 25 * p.z;
        const particleY = p.y + normMouseY * 20 * p.z;

        ctx.fillStyle = `rgba(186, 230, 253, ${currentAlpha})`;
        ctx.beginPath();
        ctx.arc(particleX, particleY, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Reset composite operation
      ctx.globalCompositeOperation = 'source-over';

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
        willChange: 'transform',
      }}
      aria-hidden="true"
    />
  );
}
