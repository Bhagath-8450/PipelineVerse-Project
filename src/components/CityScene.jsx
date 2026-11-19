import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text, Stars, Line } from "@react-three/drei";
import { Suspense, useMemo } from "react";
import * as THREE from "three";

const STATUS_COLORS = {
  success: "#22c55e",
  running: "#38bdf8",
  failure: "#ef4444",
  blocked: "#f59e0b",
  pending: "#64748b"
};

function Building({ job, position, selected, onSelect }) {
  const color = STATUS_COLORS[job.status] || STATUS_COLORS.pending;
  const height = 1.25 + (job.order % 3) * 0.42;

  return (
    <group position={position} onClick={(event) => {
      event.stopPropagation();
      onSelect(job.id);
    }}>
      <mesh position={[0, height / 2, 0]} castShadow>
        <boxGeometry args={[1.05, height, 1.05]} />
        <meshStandardMaterial
          color={selected ? "#dbeafe" : color}
          emissive={color}
          emissiveIntensity={selected ? 0.55 : job.status === "running" ? 0.45 : 0.16}
          roughness={0.35}
          metalness={0.35}
        />
      </mesh>
      {Array.from({ length: Math.max(1, Math.floor(height * 2)) }).map((_, i) => (
        <mesh key={i} position={[0, 0.35 + i * 0.42, 0.531]}>
          <planeGeometry args={[0.48, 0.18]} />
          <meshBasicMaterial color="#dbeafe" transparent opacity={0.75} />
        </mesh>
      ))}
      <mesh position={[0, 0.04, 0]}>
        <boxGeometry args={[1.35, 0.08, 1.35]} />
        <meshStandardMaterial color={selected ? "#60a5fa" : "#334155"} />
      </mesh>
      <Text
        position={[0, height + 0.35, 0]}
        fontSize={0.22}
        color="#e2e8f0"
        anchorX="center"
        anchorY="middle"
        maxWidth={2.2}
        textAlign="center"
      >
        {job.name}
      </Text>
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[1.5, 0.02, 1.5]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}

function SceneContents({ jobs, selectedId, onSelect }) {
  const positions = useMemo(() => {
    const map = {};
    const spacing = 2.7;
    jobs.forEach((job, index) => {
      const col = index % 3;
      const row = Math.floor(index / 3);
      map[job.id] = [(col - 1) * spacing, 0, (row - 0.5) * spacing];
    });
    return map;
  }, [jobs]);

  const edges = useMemo(() => {
    const result = [];
    jobs.forEach((job) => {
      job.needs.forEach((dependency) => {
        if (positions[dependency] && positions[job.id]) {
          const a = positions[dependency];
          const b = positions[job.id];
          result.push([new THREE.Vector3(a[0], 0.15, a[2]), new THREE.Vector3(b[0], 0.15, b[2])]);
        }
      });
    });
    return result;
  }, [jobs, positions]);

  return (
    <>
      <color attach="background" args={["#080d19"]} />
      <fog attach="fog" args={["#080d19", 13, 28]} />
      <ambientLight intensity={1.1} />
      <directionalLight position={[5, 9, 5]} intensity={2.1} castShadow />
      <pointLight position={[-5, 5, -4]} intensity={1.1} color="#2563eb" />
      <Stars radius={55} depth={25} count={650} factor={2} fade speed={0.4} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.08, 0]} receiveShadow>
        <planeGeometry args={[30, 24]} />
        <meshStandardMaterial color="#111c30" metalness={0.25} roughness={0.8} />
      </mesh>
      <gridHelper args={[24, 24, "#244064", "#172943"]} position={[0, -0.04, 0]} />
      {edges.map((points, index) => (
        <Line key={index} points={points} color="#60a5fa" lineWidth={2} transparent opacity={0.8} />
      ))}
      {jobs.map((job) => (
        <Building
          key={job.id}
          job={job}
          position={positions[job.id]}
          selected={selectedId === job.id}
          onSelect={onSelect}
        />
      ))}
      <OrbitControls makeDefault minDistance={6} maxDistance={22} maxPolarAngle={Math.PI / 2.05} />
    </>
  );
}

export default function CityScene({ jobs, selectedId, onSelect }) {
  return (
    <div className="canvas-wrap">
      <Canvas camera={{ position: [8, 8, 11], fov: 48 }} shadows dpr={[1, 1.7]}>
        <Suspense fallback={null}>
          <SceneContents jobs={jobs} selectedId={selectedId} onSelect={onSelect} />
        </Suspense>
      </Canvas>
      <div className="canvas-hint">DRAG TO ORBIT · SCROLL TO ZOOM · CLICK A BUILDING</div>
    </div>
  );
}
