import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { 
  Defs, 
  LinearGradient, 
  Stop, 
  Circle, 
  Path, 
  Ellipse,
  RadialGradient,
  Filter,
  FeDropShadow
} from 'react-native-svg';

interface AppIconProps {
  size?: number;
}

export default function AppIcon({ size = 1024 }: AppIconProps) {
  const iconSize = size;
  const center = iconSize / 2;
  
  return (
    <View style={[styles.container, { width: iconSize, height: iconSize }]}>
      <Svg width={iconSize} height={iconSize} viewBox={`0 0 ${iconSize} ${iconSize}`}>
        <Defs>
          {/* Background Gradient */}
          <RadialGradient id="backgroundGradient" cx="50%" cy="30%" r="80%">
            <Stop offset="0%" stopColor="#1e1b4b" />
            <Stop offset="50%" stopColor="#312e81" />
            <Stop offset="100%" stopColor="#0f0f23" />
          </RadialGradient>
          
          {/* Guitar Body Gradient */}
          <LinearGradient id="guitarBodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#fbbf24" />
            <Stop offset="30%" stopColor="#f59e0b" />
            <Stop offset="70%" stopColor="#d97706" />
            <Stop offset="100%" stopColor="#92400e" />
          </LinearGradient>
          
          {/* Guitar Neck Gradient */}
          <LinearGradient id="neckGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#78716c" />
            <Stop offset="50%" stopColor="#57534e" />
            <Stop offset="100%" stopColor="#44403c" />
          </LinearGradient>
          
          {/* Fretboard Gradient */}
          <LinearGradient id="fretboardGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#292524" />
            <Stop offset="50%" stopColor="#1c1917" />
            <Stop offset="100%" stopColor="#0c0a09" />
          </LinearGradient>
          
          {/* String Gradient */}
          <LinearGradient id="stringGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#e5e7eb" />
            <Stop offset="50%" stopColor="#d1d5db" />
            <Stop offset="100%" stopColor="#9ca3af" />
          </LinearGradient>
          
          {/* Note Button Gradients */}
          <RadialGradient id="greenNote" cx="50%" cy="30%" r="70%">
            <Stop offset="0%" stopColor="#bbf7d0" />
            <Stop offset="30%" stopColor="#34d399" />
            <Stop offset="70%" stopColor="#10b981" />
            <Stop offset="100%" stopColor="#047857" />
          </RadialGradient>
          
          <RadialGradient id="redNote" cx="50%" cy="30%" r="70%">
            <Stop offset="0%" stopColor="#fecaca" />
            <Stop offset="30%" stopColor="#f87171" />
            <Stop offset="70%" stopColor="#ef4444" />
            <Stop offset="100%" stopColor="#dc2626" />
          </RadialGradient>
          
          <RadialGradient id="yellowNote" cx="50%" cy="30%" r="70%">
            <Stop offset="0%" stopColor="#fef3c7" />
            <Stop offset="30%" stopColor="#fbbf24" />
            <Stop offset="70%" stopColor="#f59e0b" />
            <Stop offset="100%" stopColor="#d97706" />
          </RadialGradient>
          
          <RadialGradient id="blueNote" cx="50%" cy="30%" r="70%">
            <Stop offset="0%" stopColor="#dbeafe" />
            <Stop offset="30%" stopColor="#60a5fa" />
            <Stop offset="70%" stopColor="#3b82f6" />
            <Stop offset="100%" stopColor="#2563eb" />
          </RadialGradient>
          
          <RadialGradient id="orangeNote" cx="50%" cy="30%" r="70%">
            <Stop offset="0%" stopColor="#fed7aa" />
            <Stop offset="30%" stopColor="#fb923c" />
            <Stop offset="70%" stopColor="#f97316" />
            <Stop offset="100%" stopColor="#ea580c" />
          </RadialGradient>
          
          {/* Glow Effects */}
          <Filter id="glow">
            <FeDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#ffffff" floodOpacity="0.3"/>
          </Filter>
          
          <Filter id="noteGlow">
            <FeDropShadow dx="0" dy="0" stdDeviation="12" floodColor="#ffffff" floodOpacity="0.6"/>
          </Filter>
        </Defs>
        
        {/* Background Circle */}
        <Circle
          cx={center}
          cy={center}
          r={center - 20}
          fill="url(#backgroundGradient)"
          stroke="#4c1d95"
          strokeWidth="8"
        />
        
        {/* Guitar Body */}
        <Ellipse
          cx={center}
          cy={center + 120}
          rx="180"
          ry="220"
          fill="url(#guitarBodyGradient)"
          stroke="#92400e"
          strokeWidth="4"
        />
        
        {/* Sound Hole */}
        <Circle
          cx={center}
          cy={center + 120}
          r="60"
          fill="#1c1917"
          stroke="#78716c"
          strokeWidth="3"
        />
        
        {/* Sound Hole Rosette */}
        <Circle
          cx={center}
          cy={center + 120}
          r="75"
          fill="none"
          stroke="#d97706"
          strokeWidth="2"
          strokeDasharray="8,4"
        />
        
        {/* Guitar Neck */}
        <Path
          d={`M ${center - 40} ${center - 280} 
              L ${center + 40} ${center - 280} 
              L ${center + 60} ${center - 100} 
              L ${center - 60} ${center - 100} Z`}
          fill="url(#neckGradient)"
          stroke="#44403c"
          strokeWidth="2"
        />
        
        {/* Fretboard */}
        <Path
          d={`M ${center - 35} ${center - 275} 
              L ${center + 35} ${center - 275} 
              L ${center + 55} ${center - 105} 
              L ${center - 55} ${center - 105} Z`}
          fill="url(#fretboardGradient)"
        />
        
        {/* Frets */}
        {[0, 1, 2, 3, 4].map((fret) => {
          const y = center - 260 + (fret * 35);
          const leftX = center - 35 + (fret * 4);
          const rightX = center + 35 - (fret * 4);
          return (
            <Path
              key={fret}
              d={`M ${leftX} ${y} L ${rightX} ${y}`}
              stroke="#78716c"
              strokeWidth="2"
            />
          );
        })}
        
        {/* Guitar Strings */}
        {[-20, -12, -4, 4, 12, 20].map((offset, index) => (
          <Path
            key={index}
            d={`M ${center + offset * 0.6} ${center - 275} 
                L ${center + offset * 1.8} ${center - 105}`}
            stroke="url(#stringGradient)"
            strokeWidth="1.5"
            opacity="0.8"
          />
        ))}
        
        {/* Guitar Hero Style Notes */}
        {/* Green Note */}
        <Circle
          cx={center - 120}
          cy={center - 180}
          r="35"
          fill="url(#greenNote)"
          stroke="#047857"
          strokeWidth="3"
          filter="url(#noteGlow)"
        />
        
        {/* Red Note */}
        <Circle
          cx={center - 60}
          cy={center - 220}
          r="35"
          fill="url(#redNote)"
          stroke="#dc2626"
          strokeWidth="3"
          filter="url(#noteGlow)"
        />
        
        {/* Yellow Note */}
        <Circle
          cx={center}
          cy={center - 240}
          r="35"
          fill="url(#yellowNote)"
          stroke="#d97706"
          strokeWidth="3"
          filter="url(#noteGlow)"
        />
        
        {/* Blue Note */}
        <Circle
          cx={center + 60}
          cy={center - 220}
          r="35"
          fill="url(#blueNote)"
          stroke="#2563eb"
          strokeWidth="3"
          filter="url(#noteGlow)"
        />
        
        {/* Orange Note */}
        <Circle
          cx={center + 120}
          cy={center - 180}
          r="35"
          fill="url(#orangeNote)"
          stroke="#ea580c"
          strokeWidth="3"
          filter="url(#noteGlow)"
        />
        
        {/* Note Highlights */}
        {[
          { cx: center - 120, cy: center - 180, color: '#bbf7d0' },
          { cx: center - 60, cy: center - 220, color: '#fecaca' },
          { cx: center, cy: center - 240, color: '#fef3c7' },
          { cx: center + 60, cy: center - 220, color: '#dbeafe' },
          { cx: center + 120, cy: center - 180, color: '#fed7aa' }
        ].map((note, index) => (
          <Circle
            key={index}
            cx={note.cx}
            cy={note.cy}
            r="15"
            fill={note.color}
            opacity="0.6"
          />
        ))}
        
        {/* Headstock */}
        <Path
          d={`M ${center - 40} ${center - 280} 
              L ${center + 40} ${center - 280} 
              L ${center + 50} ${center - 320} 
              L ${center - 50} ${center - 320} Z`}
          fill="url(#neckGradient)"
          stroke="#44403c"
          strokeWidth="2"
        />
        
        {/* Tuning Pegs */}
        {[-25, -15, -5, 5, 15, 25].map((offset, index) => (
          <Circle
            key={index}
            cx={center + offset}
            cy={center - 300}
            r="6"
            fill="#78716c"
            stroke="#57534e"
            strokeWidth="1"
          />
        ))}
        
        {/* Musical Notes Floating Around */}
        {[
          { x: center - 200, y: center - 50, rotation: -15 },
          { x: center + 200, y: center - 80, rotation: 25 },
          { x: center - 180, y: center + 150, rotation: 10 },
          { x: center + 180, y: center + 120, rotation: -20 }
        ].map((note, index) => (
          <g key={index} transform={`rotate(${note.rotation} ${note.x} ${note.y})`}>
            <Circle
              cx={note.x}
              cy={note.y}
              r="8"
              fill="#fbbf24"
              opacity="0.8"
            />
            <Path
              d={`M ${note.x + 8} ${note.y} L ${note.x + 8} ${note.y - 25}`}
              stroke="#fbbf24"
              strokeWidth="2"
              opacity="0.8"
            />
          </g>
        ))}
        
        {/* Sparkle Effects */}
        {[
          { x: center - 150, y: center - 300 },
          { x: center + 150, y: center - 280 },
          { x: center - 100, y: center + 200 },
          { x: center + 100, y: center + 180 }
        ].map((sparkle, index) => (
          <g key={index}>
            <Path
              d={`M ${sparkle.x} ${sparkle.y - 8} 
                  L ${sparkle.x + 3} ${sparkle.y - 3} 
                  L ${sparkle.x + 8} ${sparkle.y} 
                  L ${sparkle.x + 3} ${sparkle.y + 3} 
                  L ${sparkle.x} ${sparkle.y + 8} 
                  L ${sparkle.x - 3} ${sparkle.y + 3} 
                  L ${sparkle.x - 8} ${sparkle.y} 
                  L ${sparkle.x - 3} ${sparkle.y - 3} Z`}
              fill="#ffffff"
              opacity="0.9"
              filter="url(#glow)"
            />
          </g>
        ))}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});