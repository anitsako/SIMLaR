import { useMetaliferos } from './use-metaliferos';
import { CircleMarker } from '@/mapa-principal/circle-marker';

export const Metaliferos = () => {
  const { data: metaliferos } = useMetaliferos();

  if (!metaliferos) {
    return null;
  }

  console.log(metaliferos);

  return metaliferos.map((metalifero, index) => (
    <CircleMarker
      key={metalifero.id}
      position={[metalifero.coordenadasGeograficas[1], metalifero.coordenadasGeograficas[0]]}
      value={index + 1}
      title={metalifero.nombre}
      color="red"
    />
  ));
};
