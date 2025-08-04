import { Grid, OrbitControls, StatsGl } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import React, { Suspense, useEffect, useState } from 'react';
import { rlSimulationService } from '../services/rlSimulationService';

interface DeviceProps {
  pos: number[]; // [x,y]
  battery?: number;
}

const SensorCube: React.FC<DeviceProps> = ({ pos, battery = 100 }) => {
  const [posX, posY] = pos;
  const color = battery > 50 ? 'limegreen' : battery > 20 ? 'gold' : 'crimson';
  const worldX = posX - 4.5;
  const worldZ = posY - 4.5;
  return (
    <mesh position={[worldX, 0.5, worldZ]} castShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

const RLSimulator3D: React.FC = () => {
  const [state, setState] = useState<number[]>([0, 0]);
  const [goal, setGoal] = useState<number[]>([9, 9]);
  const [obstacles, setObstacles] = useState<number[][]>([]);
  const [auto, setAuto] = useState<boolean>(false);

  // Load initial env state on mount
  useEffect(() => {
    const fetchInit = async () => {
      try {
        const init = await rlSimulationService.reset();
        setState(init.state);
        setGoal(init.goal);
        setObstacles(init.obstacles);
      } catch (err) {
        console.error('Failed to init RL sim:', err);
      }
    };
    fetchInit();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (auto) {
      interval = setInterval(async () => {
        try {
          const res = await rlSimulationService.stepPolicy();
          setState(res.state);
          setGoal(res.goal);
          setObstacles(res.obstacles);
          if (res.terminated || res.truncated) {
            const init = await rlSimulationService.reset();
            setState(init.state);
            setGoal(init.goal);
            setObstacles(init.obstacles);
          }
        } catch (err) {
          console.error(err);
        }
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [auto]);

  const handleManualStep = async (action: number) => {
    const res = await rlSimulationService.step(action);
    setState(res.state);
    setGoal(res.goal);
    setObstacles(res.obstacles);
  };

  const handleReset = async () => {
    const init = await rlSimulationService.reset();
    setState(init.state);
    setGoal(init.goal);
    setObstacles(init.obstacles);
  };

  return (
    <div className="flex flex-col items-center gap-6 mt-4">
      <Canvas shadows camera={{ position: [5, 6, 8], fov: 50 }} style={{ height: 600, width: 600 }}>
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[5, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <Suspense fallback={null}>
          {/* solid ground */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.001, 0]} receiveShadow>
            <planeGeometry args={[20, 20]} />
            <meshStandardMaterial color="#2e2e2e" />
          </mesh>
          {/* grid overlay */}
          <Grid
            args={[10, 10]}
            cellColor="#60a5fa"
            sectionColor="#1e3a8a"
            cellThickness={0.6}
            sectionThickness={1.2}
            fadeDistance={40}
            fadeStrength={1}
          />
          <SensorCube pos={state} />
          {obstacles.map((o, idx) => (
            <mesh key={idx} position={[o[0] - 4.5, 0.5, o[1] - 4.5]}>
              <sphereGeometry args={[0.5, 16, 16]} />
              <meshStandardMaterial color="red" />
            </mesh>
          ))}
          {/* goal */}
          <mesh position={[goal[0] - 4.5, 0.25, goal[1] - 4.5]}>
            <cylinderGeometry args={[0.1, 0.1, 0.5, 8]} />
            <meshStandardMaterial color="gold" />
          </mesh>
        </Suspense>
        <OrbitControls enablePan enableRotate enableZoom />
        <StatsGl />
      </Canvas>

      <div className="flex flex-wrap justify-center gap-2 mt-6">
        <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={() => handleManualStep(0)}>
          Idle
        </button>
        <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={() => handleManualStep(1)}>
          Measure &amp; TX
        </button>
        <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={() => handleManualStep(2)}>
          Irrigate
        </button>
        <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={() => handleManualStep(3)}>
          Fertilize
        </button>
        <button className="px-2 py-1 bg-purple-600 text-white rounded" onClick={() => handleManualStep(4)}>
          ↑
        </button>
        <button className="px-2 py-1 bg-purple-600 text-white rounded" onClick={() => handleManualStep(5)}>
          ↓
        </button>
        <button className="px-2 py-1 bg-purple-600 text-white rounded" onClick={() => handleManualStep(6)}>
          ←
        </button>
        <button className="px-2 py-1 bg-purple-600 text-white rounded" onClick={() => handleManualStep(7)}>
          →
        </button>
        <button className="px-3 py-1 bg-green-600 text-white rounded" onClick={() => setAuto(a => !a)}>
          {auto ? 'Auto: ON' : 'Auto: OFF'}
        </button>
        <button className="px-3 py-1 bg-gray-600 text-white rounded" onClick={handleReset}>
          Reset
        </button>
      </div>
    </div>
  );
};

export default RLSimulator3D;