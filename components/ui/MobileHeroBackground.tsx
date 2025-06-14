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
          radius: Math.random() * 4 + 6, // Radius between 6 and 10
          vx: (Math.random() - 0.5) * 0.59, // Slow horizontal velocity
          vy: (Math.random() - 0.5) * 0.79, // Slightly faster vertical velocity
          color: blueShades[Math.floor(Math.random() * blueShades.length)],
          opacity: Math.random() * 0.5 + 0.4, // Opacity between 0.4 and 0.9
        });
      }
    };

    const animate = () => {
      if (!ctx || !canvasRef.current) return; // Ensure context and canvas are still valid
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      bubblesRef.current.forEach(bubble => {
        bubble.x += bubble.vx;
        bubble.y += bubble.vy;

        if (bubble.x - bubble.radius < 0 || bubble.x + bubble.radius > canvasRef.current!.width) {
          bubble.vx *= -1;
        }
        if (bubble.y - bubble.radius < 0 || bubble.y + bubble.radius > canvasRef.current!.height) {
          bubble.vy *= -1;
        }

        bubble.x = Math.max(bubble.radius, Math.min(canvasRef.current!.width - bubble.radius, bubble.x));
        bubble.y = Math.max(bubble.radius, Math.min(canvasRef.current!.height - bubble.radius, bubble.y));

        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
        ctx.fillStyle = bubble.color;
        ctx.fill();
        ctx.closePath();
      });

      animationFrameIdRef.current = requestAnimationFrame(animate);
    };

    const startAnimation = () => {
      if (!animationFrameIdRef.current) {
        animate();
      }
    };

    const stopAnimation = () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
      }
    };

    setCanvasDimensions(); // Initial setup

    // Intersection Observer
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startAnimation();
        } else {
          stopAnimation();
        }
      },
      { threshold: 0.1 } // Trigger when 10% of the element is visible
    );

    if (canvas) {
      observer.observe(canvas);
    }

    // Handle resize
    const resizeObserver = new ResizeObserver(setCanvasDimensions);
    if (canvas && canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    // Cleanup
    return () => {
      stopAnimation();
      if (canvas) {
        observer.unobserve(canvas);
      }
      observer.disconnect();
      if (canvas && canvas.parentElement) {
        resizeObserver.unobserve(canvas.parentElement);
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
