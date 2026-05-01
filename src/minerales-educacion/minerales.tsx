import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, useGLTF } from '@react-three/drei';
import { Suspense } from 'react';
import { Card, CardBody, CardHeader, Chip, Divider } from '@heroui/react';
import type { Mineral, MineralProps, modelProps } from './datos-minerales';

function Model(props: modelProps) {
  const { scene } = useGLTF(props.modelPath);
  return <primitive object={scene} scale={1.3} />;
}

export default function Mineral({ mineral }: MineralProps) {
  return (
    <div className="flex flex-row mt-8 gap-4">
      <div className="flex flex-row gap-4">
        <Card className="w-1/2 mb-5 bg-gradient-to-br from-red-50 to-yellow-100 shadow-xl border border-red-200">
          <CardHeader
            className={`text-center text-2xl font-bold bg-gradient-to-r ${mineral.primerColorHeader} ${mineral.segundoColorHeader} text-white rounded-t-lg`}
          >
            <div className="flex items-center justify-center gap-2">{mineral.name}</div>
          </CardHeader>
          <CardBody className="p-6 space-y-4">
            <div className="text-center">
              <p className={`text-lg font-semibold text-${mineral.color}-800 mb-2`}>Descripción General</p>
              <p className="text-gray-700 leading-relaxed">{mineral.descripcion}</p>
            </div>

            <Divider />

            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className={`font-semibold text-${mineral.color}-700`}>Fórmula Química:</p>
                <p className="text-gray-600">{mineral.formulaQuimica}</p>
              </div>
              <div>
                <p className={`font-semibold text-${mineral.color}-700`}>Sistema Cristalino:</p>
                <p className="text-gray-600">{mineral.sistemaCristalino}</p>
              </div>
              <div>
                <p className={`font-semibold text-${mineral.color}-700`}>Dureza (Mohs):</p>
                <p className="text-gray-600">{mineral.dureza}</p>
              </div>
              <div>
                <p className={`font-semibold text-${mineral.color}-700`}>Color Característico:</p>
                <p className="text-gray-600">{mineral.colorCaracteristico}</p>
              </div>
            </div>

            <Divider />

            <div>
              <p className={`font-semibold text-${mineral.color}-700 mb-2`}>Usos y Aplicaciones:</p>
              <div className="flex flex-wrap gap-2">
                {mineral.usosAplicaciones.map((uso) => (
                  <Chip key={uso} color={mineral.chipColor} variant="flat">
                    {uso}
                  </Chip>
                ))}
              </div>
            </div>

            <Divider />

            {mineral.origenGeologico && (
              <div>
                <p className={`font-semibold text-${mineral.color}-700`}>Origen Geológico:</p>
                <p className="text-gray-600">{mineral.origenGeologico}</p>
              </div>
            )}
          </CardBody>
        </Card>
        {mineral.modelPath ? (
          <Canvas style={{ height: '650px', width: '50%' }} frameloop="always" dpr={[1, 1.15]}>
            <Suspense fallback={null}>
              <Stage environment="city" intensity={0.6} shadows={false}>
                <Model modelPath={mineral.modelPath} />
              </Stage>
              <OrbitControls enableZoom={true} autoRotate autoRotateSpeed={5} />
            </Suspense>
          </Canvas>
        ) : (
          <div className="flex items-center justify-center p-8">
            <p className="text-gray-400">Modelo no disponible</p>
          </div>
        )}
      </div>
    </div>
  );
}
