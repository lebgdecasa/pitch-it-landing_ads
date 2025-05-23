import React, { useEffect, useRef } from 'react';

const WavyLinesBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions to match window size
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    setCanvasDimensions();
    window.addEventListener('resize', setCanvasDimensions);
    
    // Define wave properties
    const waves = [
      { amplitude: 20, frequency: 0.005, speed: 0.03, y: canvas.height * 0.2, color: 'rgba(30, 64, 175, 0.15)' }, // Dark blue (low opacity)
      { amplitude: 25, frequency: 0.008, speed: 0.02, y: canvas.height * 0.35, color: 'rgba(59, 130, 246, 0.12)' }, // Medium blue
      { amplitude: 15, frequency: 0.01, speed: 0.04, y: canvas.height * 0.5, color: 'rgba(96, 165, 250, 0.1)' }, // Light blue
      { amplitude: 30, frequency: 0.006, speed: 0.025, y: canvas.height * 0.65, color: 'rgba(37, 99, 235, 0.08)' }, // Royal blue
      { amplitude: 18, frequency: 0.012, speed: 0.035, y: canvas.height * 0.8, color: 'rgba(30, 58, 138, 0.07)' }, // Navy blue
    ];
    
    // Animation variables
    let animationFrameId: number;
    let time = 0;
    
    // Draw wave function
    const drawWave = (wave: typeof waves[0], time: number) => {
      ctx.beginPath();
      ctx.moveTo(0, wave.y);
      
      for (let x = 0; x < canvas.width; x++) {
        // Calculate y position with sine wave
        const y = wave.y + 
                 Math.sin(x * wave.frequency + time * wave.speed) * wave.amplitude + 
                 Math.sin(x * wave.frequency * 0.5 + time * wave.speed * 1.5) * (wave.amplitude * 0.5);
        
        ctx.lineTo(x, y);
      }
      
      // Complete the wave path
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();
      
      // Fill the wave
      ctx.fillStyle = wave.color;
      ctx.fill();
    };
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw each wave
      waves.forEach(wave => {
        drawWave(wave, time);
      });
      
      time += 1;
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
      cancelAnimationFrame(animationFrameId);
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

export default WavyLinesBackground;
