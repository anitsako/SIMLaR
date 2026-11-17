import { Canvas } from '@react-three/fiber';
import { Html, OrbitControls, Stage, useGLTF } from '@react-three/drei';
import { Suspense } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Chip,
  CircularProgress,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from '@heroui/react';
import { useTranslation } from 'react-i18next';
import type { Mineral, MineralProps, modelProps } from './datos-minerales';

function Model(props: modelProps) {
  const { scene } = useGLTF(props.modelPath);
  return <primitive object={scene} scale={1.3} />;
}

export default function Mineral({ mineral }: MineralProps) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-row mt-8 gap-4">
      <div className="flex flex-row gap-4">
        <Card className="w-1/2 mb-5 bg-gradient-to-br from-red-50 to-yellow-100 shadow-xl border border-red-200">
          <CardHeader
            className={`text-center text-2xl font-bold bg-gradient-to-r ${mineral.primerColorHeader} ${mineral.segundoColorHeader} text-white rounded-t-lg`}
          >
            <div className="flex items-center justify-center gap-2">{t(mineral.name)}</div>
          </CardHeader>
          <CardBody className="p-6 space-y-4">
            <div className="text-center">
              <p className={`text-lg font-semibold text-${mineral.color}-800 mb-2`}>{t('routes.educacion.informativa.ficha.descripcionGeneral')}</p>
              <p className="text-gray-700 leading-relaxed">{t(mineral.descripcion)}</p>
            </div>

            <Divider />

            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className={`font-semibold text-${mineral.color}-700`}>{t('routes.educacion.informativa.ficha.formulaQuimica')}</p>
                <p className="text-gray-600">{mineral.formulaQuimica}</p>
              </div>
              <div>
                <p className={`font-semibold text-${mineral.color}-700`}>{t('routes.educacion.informativa.ficha.sistemaCristalino')}</p>
                <p className="text-gray-600">{mineral.sistemaCristalino && t(mineral.sistemaCristalino)}</p>
              </div>
              <div>
                <p className={`font-semibold text-${mineral.color}-700`}>{t('routes.educacion.informativa.ficha.dureza')}</p>
                <p className="text-gray-600">{mineral.dureza}</p>
              </div>
              <div>
                <p className={`font-semibold text-${mineral.color}-700`}>{t('routes.educacion.informativa.ficha.colorCaracteristico')}</p>
                <p className="text-gray-600">{t(mineral.colorCaracteristico)}</p>
              </div>
            </div>

            <Divider />
            {mineral.usosAplicaciones && (
              <div>
                <p className={`font-semibold text-${mineral.color}-700 mb-2`}>{t('routes.educacion.informativa.ficha.usos')}</p>
                <div className="flex flex-wrap gap-2">
                  {mineral.usosAplicaciones.map((uso) => (
                    <Dropdown
                      showArrow
                      classNames={{
                        base: 'before:bg-default-200 ',
                        content: 'border border-default-200 bg-white text-black-400',
                      }}
                    >
                      <DropdownTrigger>
                        <Chip key={uso.name} color={mineral.chipColor} variant="flat" className="cursor-pointer">
                          {t(uso.name)}
                        </Chip>
                      </DropdownTrigger>
                      <DropdownMenu className="max-w-[280px]">
                        <DropdownSection title={t(uso.name)}>
                          <DropdownItem
                            key={uso.name}
                            isReadOnly
                            className="data-[hover=true]:bg-white data-[hover=true]:text-black block w-full cursor-default text-left text-black text-md whitespace-normal break-words leading-relaxed"
                          >
                            <div className="whitespace-normal break-words">{t(uso.detalle)}</div>
                          </DropdownItem>
                        </DropdownSection>
                      </DropdownMenu>
                    </Dropdown>
                  ))}
                </div>
              </div>
            )}

            {mineral.usosAplicaciones && <Divider />}

            {mineral.origenGeologico && (
              <div>
                <p className={`font-semibold text-${mineral.color}-700`}>{t('routes.educacion.informativa.ficha.origenGeologico')}</p>
                <p className="text-gray-600">{t(mineral.origenGeologico)}</p>
              </div>
            )}
          </CardBody>
        </Card>
        {mineral.modelPath ? (
          <Canvas style={{ height: '650px', width: '50%' }} frameloop="always" dpr={[1, 1.15]}>
            <Suspense
              fallback={
                <Html center>
                  <CircularProgress label={t('routes.educacion.informativa.ficha.cargandoModelo')} color="default" />
                </Html>
              }
            >
              <Stage environment="city" intensity={0.6} shadows={false}>
                <Model modelPath={mineral.modelPath} />
              </Stage>
              <OrbitControls enableZoom={true} autoRotate autoRotateSpeed={5} />
            </Suspense>
          </Canvas>
        ) : (
          <div className="flex items-center justify-center p-8">
            <p className="text-gray-400">{t('routes.educacion.informativa.ficha.modeloNoDisponible')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
