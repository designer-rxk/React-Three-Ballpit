import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Physics, usePlane, useSphere } from "@react-three/cannon"

export default function App() {
  return (
    <Canvas shadows gl={{ stencil: false, antialias: false }} camera={{ position: [0, 0, 20], fov: 50, near: 15, far: 30 }}>
      <color attach="background" args={["#FF703A"]} />
      <ambientLight intensity={1.5} />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} />
      <directionalLight
        castShadow
        intensity={4}
        position={[50, 50, 25]}
        shadow-mapSize={[256, 256]}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <Physics gravity={[0, -50, 0]} defaultContactMaterial={{ restitution: 0.5 }}>
        <group position={[0, 0, -10]}>
          <Mouse />
          <Borders />
          <InstancedSpheres />
        </group>
      </Physics>
    </Canvas>
  )
}

function InstancedSpheres({ count = 100 }) {
  const [ref] = useSphere(() => ({ mass: 1, position: [4 - Math.random() * 8, 0, 0, 0], args: [1] }))

  return (
    <instancedMesh ref={ref} castShadow receiveShadow args={[null, null, count]}>
      <sphereBufferGeometry args={[1, 32, 32]} />
      <meshLambertMaterial color="#C95830" />
    </instancedMesh>
  )
}

function Borders() {
  const { viewport } = useThree()

  const boxWidth = 15
  const boxDepth = 17.5

  return (
    <>
      <Plane position={[0, -boxDepth / 2, 0]} rotation={[-Math.PI / 2, 0, 0]} args={[boxWidth, boxDepth]} />
      <Plane position={[-boxWidth / 2 - 1, 0, 0]} rotation={[0, Math.PI / 2, 0]} args={[boxDepth, boxWidth]} />
      <Plane position={[boxWidth / 2 + 1, 0, 0]} rotation={[0, -Math.PI / 2, 0]} args={[boxDepth, boxWidth]} />
      <Plane position={[0, 0, 0]} rotation={[0, 0, 0]} args={[boxWidth, boxDepth]} />
      <Plane position={[0, 0, 12]} rotation={[0, -Math.PI, 0]} args={[boxWidth, boxDepth]} />
    </>
  )
}

function Plane({ color, ...props }) {
  usePlane(() => ({ ...props }))
  return null
}

function Mouse() {
  const { viewport } = useThree()
  const [, api] = useSphere(() => ({ type: "Dynamic", args: [7] }))
  return useFrame((state) => api.position.set((state.mouse.x * viewport.width) / 2, (state.mouse.y * viewport.height) / 2, 10))
}
