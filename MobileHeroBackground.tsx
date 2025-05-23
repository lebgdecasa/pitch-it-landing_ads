import React, { useEffect, useRef } from 'react';

interface Bubble {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  color: string;
  opacity: number;
}

const MobileHeroBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bubblesRef = useRef<Bubble[]>([]);
  const animationFrameIdRef = useRef<number | null>(null);

  const blueShades = [
    'rgba(30, 64, 175, 0.3)',  // Dark blue
    'rgba(59, 130, 246, 0.3)',  // Medium blue
    'rgba(96, 165, 250, 0.25)', // Light blue
    'rgba(37, 99, 235, 0.2)',   // Royal blue
    'rgba(30, 58, 138, 0.2)',   // Navy blue
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;

    const setCanvasDimensions = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width;
      canvas.height = height;
      // Reinitialize bubbles on resize
      initializeBubbles();
    };

    const initializeBubbles = () => {
      bubblesRef.current = [];
      const numBubbles = Math.floor((width * height) / 15000); // Adjust density based on area
      for (let i = 0; i < numBubbles; i++) {
        bubblesRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 4 + 2, // Radius between 2 and 6
          vx: (Math.random() - 0.5) * 0.5, // Slow horizontal velocity
          vy: (Math.random() - 0.5) * 0.7, // Slightly faster vertical velocity
          color: blueShades[Math.floor(Math.random() * blueShades.length)],
          opacity: Math.random() * 0.5 + 0.1, // Opacity between 0.1 and 0.6
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      bubblesRef.current.forEach(bubble => {
        // Move bubble
        bubble.x += bubble.vx;
        bubble.y += bubble.vy;

        // Bounce off edges
        if (bubble.x - bubble.radius < 0 || bubble.x + bubble.radius > width) {
          bubble.vx *= -1;
        }
        if (bubble.y - bubble.radius < 0 || bubble.y + bubble.radius > height) {
          bubble.vy *= -1;
        }
        
        // Keep bubbles within bounds after bounce
        bubble.x = Math.max(bubble.radius, Math.min(width - bubble.radius, bubble.x));
        bubble.y = Math.max(bubble.radius, Math.min(height - bubble.radius, bubble.y));

        // Draw bubble
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
        ctx.fillStyle = bubble.color; // Use bubble's specific color
        // ctx.globalAlpha = bubble.opacity; // Applying opacity directly to fillStyle is better
        ctx.fill();
        ctx.closePath();
      });

      // ctx.globalAlpha = 1.0; // Reset global alpha
      animationFrameIdRef.current = requestAnimationFrame(animate);
    };

    setCanvasDimensions(); // Initial setup
    animate(); // Start animation

    // Handle resize
    const resizeObserver = new ResizeObserver(setCanvasDimensions);
    resizeObserver.observe(canvas.parentElement!); // Observe parent size changes

    // Cleanup
    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full z-0"
      style={{ pointerEvents: 'none' }}
    />
  );
};

export default MobileHeroBackground;

