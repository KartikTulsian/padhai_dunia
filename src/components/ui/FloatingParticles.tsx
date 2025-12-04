import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  type: 'laptop' | 'graduation' | 'lightbulb' | 'dna' | 'formula' | 'neural' | 'rocket' | 'globe' | 'chip' | 'wifi';
  color: string;
}

const FloatingParticles = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  const particleTypes = ['laptop', 'graduation', 'lightbulb', 'dna', 'formula', 'neural', 'rocket', 'globe', 'chip', 'wifi'] as const;
  const colors = ['#008878', '#22d3ee', '#a855f7', '#f59e0b', '#ef4444', '#10b981', '#8b5cf6', '#06b6d4'];

  useEffect(() => {
    const generateParticles = () => {
      const newParticles: Particle[] = [];
      for (let i = 0; i < 40; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 8 + 6,
          opacity: Math.random() * 0.4 + 0.2,
          duration: Math.random() * 15 + 10,
          type: particleTypes[Math.floor(Math.random() * particleTypes.length)],
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
  }, []);

  const getParticleElement = (particle: Particle) => {
    const baseClass = "w-full h-full flex items-center justify-center relative";
    const glowClass = `drop-shadow-[0_0_8px_${particle.color}40]`;
    
    switch (particle.type) {
      case 'laptop':
        return (
          <div className={`${baseClass} ${glowClass}`} style={{ color: particle.color }}>
            <div className="w-full h-3/4 border-2 rounded-sm relative" style={{ borderColor: particle.color }}>
              <div className="w-full h-1/2 bg-gradient-to-b opacity-20 rounded-t-sm" style={{ backgroundColor: particle.color }}></div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/3 h-0.5 rounded" style={{ backgroundColor: particle.color }}></div>
            </div>
          </div>
        );
      case 'graduation':
        return (
          <div className={`${baseClass} ${glowClass} text-lg`} style={{ color: particle.color }}>
            🎓
          </div>
        );
      case 'lightbulb':
        return (
          <div className={`${baseClass}`}>
            <div className="w-full h-full relative">
              <div className="w-2/3 h-2/3 rounded-full border-2 mx-auto" style={{ borderColor: particle.color }}>
                <div className="w-full h-full rounded-full bg-gradient-radial opacity-30" style={{ backgroundColor: particle.color }}></div>
              </div>
              <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1/2 h-1 rounded" style={{ backgroundColor: particle.color }}></div>
            </div>
          </div>
        );
      case 'dna':
        return (
          <div className={`${baseClass} ${glowClass}`}>
            <div className="w-full h-full relative">
              <div className="absolute left-1/4 top-0 w-0.5 h-full rounded" style={{ backgroundColor: particle.color }}></div>
              <div className="absolute right-1/4 top-0 w-0.5 h-full rounded" style={{ backgroundColor: particle.color }}></div>
              <div className="absolute top-1/4 left-1/4 right-1/4 h-0.5 rounded" style={{ backgroundColor: particle.color }}></div>
              <div className="absolute top-3/4 left-1/4 right-1/4 h-0.5 rounded" style={{ backgroundColor: particle.color }}></div>
            </div>
          </div>
        );
      case 'formula':
        return (
          <div className={`${baseClass} ${glowClass} font-mono text-xs font-bold`} style={{ color: particle.color }}>
            E=mc²
          </div>
        );
      case 'neural':
        return (
          <div className={`${baseClass} ${glowClass}`}>
            <div className="w-full h-full relative">
              <div className="w-2 h-2 rounded-full absolute top-1 left-1" style={{ backgroundColor: particle.color }}></div>
              <div className="w-2 h-2 rounded-full absolute top-1 right-1" style={{ backgroundColor: particle.color }}></div>
              <div className="w-2 h-2 rounded-full absolute bottom-1 left-1/2 transform -translate-x-1/2" style={{ backgroundColor: particle.color }}></div>
              <div className="absolute top-2 left-2 w-4 h-0.5 rotate-45 rounded" style={{ backgroundColor: particle.color }}></div>
              <div className="absolute top-2 right-2 w-4 h-0.5 -rotate-45 rounded" style={{ backgroundColor: particle.color }}></div>
            </div>
          </div>
        );
      case 'rocket':
        return (
          <div className={`${baseClass} ${glowClass} text-lg`} style={{ color: particle.color }}>
            🚀
          </div>
        );
      case 'globe':
        return (
          <div className={`${baseClass} ${glowClass}`}>
            <div className="w-full h-full rounded-full border-2 relative" style={{ borderColor: particle.color }}>
              <div className="absolute inset-1 rounded-full opacity-20" style={{ backgroundColor: particle.color }}></div>
              <div className="absolute top-1/3 left-0 right-0 h-0.5 rounded" style={{ backgroundColor: particle.color }}></div>
              <div className="absolute top-2/3 left-0 right-0 h-0.5 rounded" style={{ backgroundColor: particle.color }}></div>
              <div className="absolute top-0 bottom-0 left-1/2 w-0.5 rounded transform -translate-x-1/2" style={{ backgroundColor: particle.color }}></div>
            </div>
          </div>
        );
      case 'chip':
        return (
          <div className={`${baseClass} ${glowClass}`}>
            <div className="w-full h-full border-2 rounded relative" style={{ borderColor: particle.color }}>
              <div className="absolute inset-1 border rounded opacity-60" style={{ borderColor: particle.color }}></div>
              <div className="absolute inset-2 bg-gradient-to-br opacity-20 rounded" style={{ backgroundColor: particle.color }}></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full" style={{ backgroundColor: particle.color }}></div>
            </div>
          </div>
        );
      case 'wifi':
        return (
          <div className={`${baseClass} ${glowClass}`}>
            <div className="w-full h-full relative">
              <div className="absolute bottom-1 left-1/2 w-1 h-1 rounded-full transform -translate-x-1/2" style={{ backgroundColor: particle.color }}></div>
              <div className="absolute bottom-2 left-1/2 w-3 h-1 border-b-2 border-l-2 border-r-2 rounded-b-full transform -translate-x-1/2" style={{ borderColor: particle.color }}></div>
              <div className="absolute bottom-2 left-1/2 w-5 h-2 border-b-2 border-l-2 border-r-2 rounded-b-full transform -translate-x-1/2" style={{ borderColor: particle.color }}></div>
            </div>
          </div>
        );
      default:
        return <div className="w-full h-full rounded-full opacity-30" style={{ backgroundColor: particle.color }}></div>;
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10"></div>
        <motion.div 
          className="absolute inset-0"
          animate={{ 
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0, 136, 120, 0.1) 1px, transparent 0)',
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Main Particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            opacity: particle.opacity,
          }}
          animate={{
            y: [0, -40, 20, -10, 0],
            x: [0, 30, -15, 8, 0],
            opacity: [particle.opacity, particle.opacity * 0.2, particle.opacity * 1.2, particle.opacity * 0.6, particle.opacity],
            rotate: [0, 360],
            scale: [1, 1.3, 0.8, 1.1, 1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 5,
          }}
        >
          {getParticleElement(particle)}
        </motion.div>
      ))}
      
      {/* Large Floating Tech Elements */}
      <motion.div
        className="absolute top-1/5 left-1/6 w-40 h-40 opacity-10"
        animate={{
          rotate: [0, 360],
          scale: [1, 1.4, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <div className="w-full h-full relative">
          <div className="w-full h-full border-4 border-primary/30 rounded-full relative overflow-hidden">
            <div className="absolute inset-4 bg-gradient-conic from-primary/20 via-accent/20 to-primary/20 rounded-full"></div>
            <motion.div 
              className="absolute inset-8 bg-primary/10 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </div>
          {/* Orbiting elements */}
          <motion.div 
            className="absolute top-2 left-1/2 w-4 h-4 bg-accent/40 rounded-full transform -translate-x-1/2"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </motion.div>
      
      {/* Neural Network Visualization */}
      <motion.div
        className="absolute bottom-1/4 right-1/5 w-48 h-48 opacity-8"
        animate={{
          rotate: [0, -360],
          scale: [1, 0.9, 1.2, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="w-full h-full relative">
          {/* Neural nodes */}
          <div className="absolute top-4 left-8 w-3 h-3 bg-primary/40 rounded-full shadow-lg shadow-primary/20"></div>
          <div className="absolute top-8 right-6 w-3 h-3 bg-accent/40 rounded-full shadow-lg shadow-accent/20"></div>
          <div className="absolute bottom-6 left-6 w-3 h-3 bg-primary/40 rounded-full shadow-lg shadow-primary/20"></div>
          <div className="absolute bottom-4 right-8 w-3 h-3 bg-accent/40 rounded-full shadow-lg shadow-accent/20"></div>
          <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-primary/60 rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-lg shadow-primary/30"></div>
          
          {/* Neural connections */}
          <motion.div 
            className="absolute top-5 left-9 w-16 h-0.5 bg-gradient-to-r from-primary/30 to-accent/30 transform rotate-12 origin-left"
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div 
            className="absolute top-1/2 left-1/2 w-12 h-0.5 bg-gradient-to-r from-accent/30 to-primary/30 transform -rotate-45 -translate-x-1/2 -translate-y-1/2"
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
          />
          <motion.div 
            className="absolute bottom-6 right-8 w-14 h-0.5 bg-gradient-to-l from-primary/30 to-accent/30 transform -rotate-12 origin-right"
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, delay: 1 }}
          />
        </div>
      </motion.div>

      {/* Data Flow Visualization */}
      <motion.div
        className="absolute top-1/3 right-1/3 w-36 h-36 opacity-6"
        animate={{
          y: [0, -20, 15, 0],
          rotate: [0, 180, 360],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="w-full h-full relative">
          <div className="w-full h-full border-2 border-accent/20 transform rotate-45 rounded-lg relative overflow-hidden">
            <motion.div 
              className="absolute inset-2 bg-gradient-to-br from-primary/20 via-accent/10 to-primary/20 rounded"
              animate={{ 
                background: [
                  'linear-gradient(45deg, rgba(0,136,120,0.2), rgba(168,85,247,0.1), rgba(0,136,120,0.2))',
                  'linear-gradient(225deg, rgba(168,85,247,0.2), rgba(0,136,120,0.1), rgba(168,85,247,0.2))',
                  'linear-gradient(45deg, rgba(0,136,120,0.2), rgba(168,85,247,0.1), rgba(0,136,120,0.2))'
                ]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            {/* Flowing data streams */}
            <motion.div 
              className="absolute top-2 left-0 right-0 h-0.5 bg-primary/40 rounded"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            <motion.div 
              className="absolute bottom-2 left-0 right-0 h-0.5 bg-accent/40 rounded"
              animate={{ x: ['100%', '-100%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 1 }}
            />
          </div>
        </div>
      </motion.div>

      {/* Floating Code Matrix */}
      <motion.div
        className="absolute top-2/3 left-1/8 w-32 h-32 opacity-4"
        animate={{
          rotate: [0, 360],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <div className="w-full h-full relative font-mono text-xs">
          <motion.div 
            className="absolute top-0 left-0 text-primary/30"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {'{ }'}
          </motion.div>
          <motion.div 
            className="absolute top-4 right-2 text-accent/30"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
          >
            01
          </motion.div>
          <motion.div 
            className="absolute bottom-4 left-2 text-primary/30"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
          >
            fn()
          </motion.div>
          <motion.div 
            className="absolute bottom-0 right-0 text-accent/30"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
          >
            AI
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default FloatingParticles;