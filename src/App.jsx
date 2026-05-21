import "./styles/galaxia.css";
import { useEffect, useState, useRef, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";

const MOMENTS = [
  { emoji: "🌅", title: "Los días normales", text: "Desde que llegaste, hasta los días normales se sienten especiales." },
  { emoji: "✨", title: "Iluminas vidas", text: "Hay personas que iluminan lugares, tú iluminas vidas." },
  { emoji: "🌿", title: "Todo más tranquilo", text: "No sé cómo lo haces, pero contigo todo parece más tranquilo y bonito." },
  { emoji: "🏡", title: "Mi lugar seguro", text: "Si tuviera que elegir un lugar seguro, probablemente sería hablar contigo." },
  { emoji: "😊", title: "Tu sonrisa", text: "Tu sonrisa tiene esa extraña capacidad de mejorar cualquier día malo." },
  { emoji: "🌊", title: "Dejas huella", text: "Algunas personas pasan por la vida… tú dejas huella." },
  { emoji: "💫", title: "Tu forma de ser", text: "Me gusta tu forma de ser, porque haces sentir bien incluso sin intentarlo." },
  { emoji: "🍀", title: "Coincidir contigo", text: "Coincidir contigo se siente como una de esas casualidades que valen muchísimo." },
  { emoji: "👁️", title: "Tu mirada", text: "Hay miradas que se olvidan rápido, pero la tuya se queda dando vueltas en la mente." },
  { emoji: "🌙", title: "Contigo ya basta", text: "A veces no hacen falta grandes momentos; estar contigo ya basta." },
  { emoji: "🌸", title: "El mundo más bonito", text: "Eres de esas personas que hacen que el mundo se sienta un poquito más bonito." },
  { emoji: "💖", title: "Persona especial", text: "Si alguien me preguntara qué significa persona especial, pensaría en ti sin dudarlo." },
];

// ====================== ESTRELLA FUGAZ MEJORADA ======================
function ShootingStar() {
  const ref = useRef();
  const tailRef = useRef();
  const [active, setActive] = useState(false);
  const [position, setPosition] = useState([0, 0, 0]);
  
  // ✅ CONFIG con useState + lazy init = seguro para render
  const [config] = useState(() => ({
    speed: 0.8 + Math.random() * 0.6,
    length: 3 + Math.random() * 4,
    hue: 180 + Math.random() * 60,
  }));

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.35) {
        setPosition([
          Math.random() * 60 - 30,
          Math.random() * 35 + 15,
          Math.random() * -20 - 15,
        ]);
        setActive(true);
        if (ref.current) ref.current.material.opacity = 1;
        if (tailRef.current) tailRef.current.material.opacity = 0.8;
        setTimeout(() => setActive(false), 1800);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useFrame(() => {
    if (!ref.current || !tailRef.current || !active) return;
    ref.current.position.x -= config.speed * 2.5;
    ref.current.position.y -= config.speed * 1.2;
    ref.current.material.opacity = Math.max(0, ref.current.material.opacity - 0.03);
    tailRef.current.position.x -= config.speed * 2.5;
    tailRef.current.position.y -= config.speed * 1.2;
    tailRef.current.material.opacity = Math.max(0, tailRef.current.material.opacity - 0.025);
  });

  if (!active) return null;

  return (
    <group position={position}>
      <mesh ref={ref}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicMaterial
          color={`hsl(${config.hue}, 100%, 95%)`}
          transparent opacity={1}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh ref={tailRef}>
        <cylinderGeometry args={[0.08, 0.02, config.length, 8]} rotation={[Math.PI / 2, 0, 0]} />
        <meshBasicMaterial
          color={`hsl(${config.hue}, 100%, 85%)`}
          transparent opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshBasicMaterial
          color={`hsl(${config.hue}, 100%, 75%)`}
          transparent opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

// ====================== PARTÍCULAS DE FONDO ======================
function BackgroundParticles() {
  const particlesRef = useRef();
  const count = 800;
  
  // ✅ Buffer generado UNA vez con useState lazy
  const [positions] = useState(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 120;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 120;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 100 - 30;
    }
    return pos;
  });

  useFrame((state) => {
    if (!particlesRef.current) return;
    particlesRef.current.rotation.z = state.clock.elapsedTime * 0.02;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        color="#c8b8ff"
        transparent opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ====================== BRILLOS ALEATORIOS ======================
function Sparkles() {
  const sparklesRef = useRef();
  const count = 150;
  
  // ✅ Datos generados UNA vez con useState lazy
  const [particleData] = useState(() => {
    const pos = new Float32Array(count * 3);
    const siz = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 100;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 100;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 80 - 20;
      siz[i] = Math.random() * 0.3 + 0.1;
    }
    return { positions: pos, sizes: siz };
  });

  useFrame((state) => {
    if (!sparklesRef.current) return;
    sparklesRef.current.material.opacity = 0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.3;
  });

  return (
    <points ref={sparklesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particleData.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={particleData.sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.4}
        color="#ffffff"
        transparent opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ====================== ESTRELLA INTERACTIVA MEJORADA ======================
// ====================== ESTRELLA INTERACTIVA MEJORADA ======================
function InteractiveStar({ position, index, moment, hue, onDiscover, isDiscovered }) {
  const starRef = useRef();
  const glowRef = useRef();
  const outerGlowRef = useRef();
  const sparklesRef = useRef();

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    // ✅ Pulsación más contenida
    const pulse = isDiscovered 
      ? 1.1 + Math.sin(time * 3 + index) * 0.05  // antes: 1.2 + 0.1
      : 1 + Math.sin(time * 4 + index) * 0.15;   // antes: 1 + 0.3
    
    if (starRef.current) {
      starRef.current.scale.setScalar(pulse);
      starRef.current.rotation.z = time * 0.3;
    }
    if (glowRef.current) {
      glowRef.current.scale.setScalar(pulse * 1.3); // antes: pulse * 2.5
      glowRef.current.material.opacity = isDiscovered ? 0.7 : 0.5; // antes: 0.9/0.6
    }
    if (outerGlowRef.current) {
      outerGlowRef.current.scale.setScalar(pulse * 1.8); // antes: pulse * 4
      outerGlowRef.current.material.opacity = isDiscovered ? 0.35 : 0.2; // antes: 0.5/0.3
    }
    if (sparklesRef.current) {
      sparklesRef.current.rotation.z = time * 0.5;
    }
  });

  return (
    <group position={position}>
      {/* ✅ Halo exterior más pequeño */}
      <mesh ref={outerGlowRef}>
        <sphereGeometry args={[0.35, 32, 32]} /> {/* antes: 0.8 */}
        <meshBasicMaterial
          color={`hsl(${hue}, 100%, 85%)`}
          transparent opacity={0.2}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      
      {/* ✅ Brillo medio más pequeño */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.26, 32, 32]} /> {/* antes: 0.5 */}
        <meshBasicMaterial
          color={`hsl(${hue}, 100%, 90%)`}
          transparent opacity={0.5}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      
      {/* ✅ Estrella principal (igual) */}
      <mesh ref={starRef} onClick={() => onDiscover(index, moment)}>
        <sphereGeometry args={[0.22, 32, 32]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>
      
      {/* ✅ Núcleo (igual) */}
      <mesh>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      
      {/* ✅ Anillo de chispas más pequeño */}
      <mesh ref={sparklesRef}>
        <ringGeometry args={[0.28, 0.32, 6]} /> {/* antes: 0.35, 0.4 */}
        <meshBasicMaterial
          color={`hsl(${hue}, 100%, 95%)`}
          transparent opacity={isDiscovered ? 0.7 : 0.4}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

// ====================== NEBULOSA DE FONDO ======================
function Nebula() {
  const nebulaRef = useRef();
  
  useFrame((state) => {
    if (nebulaRef.current) {
      nebulaRef.current.rotation.z = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <mesh ref={nebulaRef} rotation={[0.3, 0, 0]}>
      <planeGeometry args={[200, 200]} />
      <meshBasicMaterial
        color="#2a0a4f"
        transparent opacity={0.25}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

// ====================== ESCENA ======================
function Scene({ onDiscover, discoveredIds }) {
  // ✅ starsData con lazy init en useState
  const [starsData] = useState(() => {
    const cols = 4;
    return MOMENTS.map((_, i) => ({
      position: [
        ((i % cols) - 1.5) * 5.4 + (Math.random() - 0.5) * 3,
        (Math.floor(i / cols) - 1) * 4.5 + (Math.random() - 0.5) * 2.5,
        (Math.random() - 0.5) * 7 - 4,
      ],
      hue: 200 + Math.random() * 160,
    }));
  });

  return (
    <>
      <ambientLight intensity={0.3} color="#8866cc" />
      <pointLight position={[10, 15, 10]} intensity={2} color="#aaccff" />
      <pointLight position={[-15, 8, -10]} intensity={1.2} color="#ff99cc" />
      <pointLight position={[0, -10, 5]} intensity={0.8} color="#cc99ff" />

      <Stars radius={400} depth={100} count={4000} factor={4} saturation={0.8} fade speed={0.6} />
      
      <BackgroundParticles />
      <Sparkles />
      <Nebula />

      {starsData.map((star, i) => (
        <InteractiveStar
          key={i}
          index={i}
          position={star.position}
          moment={MOMENTS[i]}
          hue={star.hue}
          onDiscover={onDiscover}
          isDiscovered={discoveredIds.includes(i)}
        />
      ))}

      {Array.from({ length: 6 }).map((_, i) => (
        <ShootingStar key={i} />
      ))}

      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={7}
        maxDistance={48}
        autoRotate
        autoRotateSpeed={0.15}
      />
    </>
  );
}

// ====================== COMPONENTE PRINCIPAL ======================
export default function Galaxia3D() {
  const [started, setStarted] = useState(false);
  const [modal, setModal] = useState(null);
  const [discoveredCount, setDiscoveredCount] = useState(0);
  const [discoveredIds, setDiscoveredIds] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const [autoMode, setAutoMode] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [toast, setToast] = useState(null);

  const discoveredSetRef = useRef(new Set());
  const autoIntervalRef = useRef(null);
  const audioRef = useRef(null);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  }, []);

  const handleDiscover = useCallback(
    (index, moment) => {
      if (discoveredSetRef.current.has(index)) {
        setModal(moment);
        return;
      }

      discoveredSetRef.current.add(index);
      const newIds = Array.from(discoveredSetRef.current).sort((a, b) => a - b);

      setDiscoveredIds(newIds);
      setDiscoveredCount(newIds.length);
      setModal(moment);

      if (newIds.length === 1) showToast("🏆 Logro: Primer paso ✨");
      if (newIds.length === 6) showToast("🏆 Logro: Mitad del camino 🌟");
      if (newIds.length === MOMENTS.length) {
        showToast("🌌 Logro: Universo completo");
        setIsComplete(true);
      }
    },
    [showToast],
  );

  useEffect(() => {
    if (started && audioRef.current) {
      audioRef.current.volume = 0.35;
      audioRef.current.play().catch(() => {});
    }
  }, [started]);

  useEffect(() => {
    if (autoMode && started && !isPaused) {
      autoIntervalRef.current = setInterval(() => {
        const undiscovered = MOMENTS.map((_, i) => i).filter(
          (i) => !discoveredSetRef.current.has(i),
        );
        if (undiscovered.length > 0) {
          const randomIndex = undiscovered[Math.floor(Math.random() * undiscovered.length)];
          handleDiscover(randomIndex, MOMENTS[randomIndex]);
        } else {
          setAutoMode(false);
        }
      }, 2600);
    } else {
      clearInterval(autoIntervalRef.current);
    }
    return () => clearInterval(autoIntervalRef.current);
  }, [autoMode, started, isPaused, handleDiscover]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape" && modal) setModal(null);
      if (e.key === " " && started) {
        e.preventDefault();
        setIsPaused((p) => !p);
      }
      const num = parseInt(e.key);
      if (num > 0 && num <= MOMENTS.length) {
        setModal(MOMENTS[num - 1]);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [modal, started]);

  return (
    <>
      <audio ref={audioRef} loop src="/music/space_bg.mp3" />

      {!started ? (
        <div className="center-screen">
          <p className="pre-title">✦ para ti ✦</p>
          <h1 className="main-title">Esto es para ti</h1>
          <div className="divider" />
          <p className="subtitle">Explora mi universo en 3D</p>
          <button className="explore-btn" onClick={() => setStarted(true)}>
            Entrar al Universo 🌌
          </button>
        </div>
      ) : (
        <div className="canvas-container">
          <Canvas camera={{ position: [0, 6, 24], fov: 48 }} gl={{ antialias: true, alpha: true }}>
            <Scene onDiscover={handleDiscover} discoveredIds={discoveredIds} />
          </Canvas>

          <div className="ui-overlay">
            <div className="counter">✦ {discoveredCount} / {MOMENTS.length} descubiertos</div>
            <button className={`auto-btn ${autoMode ? "active" : ""}`} onClick={() => setAutoMode(!autoMode)}>
              {autoMode ? "⏸️ Pausar Relax" : "🌙 Modo Relax"}
            </button>
            <p className="pause-indicator" style={{ opacity: isPaused ? 1 : 0 }}>⏸️ PAUSADO (Espacio)</p>
            {isComplete && <div className="completion-badge">🌌 Has descubierto todo mi universo 🌌</div>}
          </div>
        </div>
      )}

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <span className="modal-emoji">{modal.emoji}</span>
            <h2 className="modal-title">{modal.title}</h2>
            <p className="modal-text">{modal.text}</p>
            <button className="modal-btn" onClick={() => setModal(null)}>Cerrar</button>
          </div>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </>
  );
}