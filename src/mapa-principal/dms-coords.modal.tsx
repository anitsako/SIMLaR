import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  NumberInput,
  Select,
  SelectItem,
} from '@heroui/react';
import { useState } from 'react';
import { dmsToDecimal } from '@/common/dms-to-decimal';
import { decimalToDmsObj } from '@/common/decimal-to-dms';

export const DmsCordsModal = ({
  isOpen,
  onClose,
  value,
  onValueChange,
}: {
  isOpen: boolean;
  onClose: () => void;
  value: { lat: number; lng: number };
  onValueChange: (coords: { lat: number; lng: number }) => void;
}) => {
  const [latDms, setLatDMS] = useState<{ deg: number; min: number; sec: number; dir: string }>(
    decimalToDmsObj(value.lat, true)
  );
  const [lngDms, setLngDMS] = useState<{ deg: number; min: number; sec: number; dir: string }>(
    decimalToDmsObj(value.lng, false)
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalContent>
        <ModalHeader>Ingresar coordenadas manualmente</ModalHeader>
        <ModalBody>
          <p className="text-sm font-medium">Latitud</p>
          <div className="flex gap-2 items-end">
            <NumberInput
              label="Grados"
              min={0}
              max={90}
              value={latDms.deg}
              onValueChange={(deg) => setLatDMS((prevLatDms) => ({ ...prevLatDms, deg }))}
            />
            <NumberInput
              label="Minutos"
              min={0}
              max={59}
              value={latDms.min}
              onValueChange={(min) => setLatDMS((prevLatDms) => ({ ...prevLatDms, min }))}
            />
            <NumberInput
              label="Segundos"
              min={0}
              max={59.99}
              step={0.01}
              value={latDms.sec}
              onValueChange={(sec) => setLatDMS((prevLatDms) => ({ ...prevLatDms, sec }))}
            />
            <Select
              label="Dirección"
              defaultSelectedKeys={[latDms.dir]}
              onChange={(e) => setLatDMS((prevLatDms) => ({ ...prevLatDms, dir: e.target.value }))}
            >
              <SelectItem key="N">Norte</SelectItem>
              <SelectItem key="S">Sur</SelectItem>
            </Select>
          </div>
          <p className="text-sm font-medium mt-4">Longitud</p>
          <div className="flex gap-2 items-end">
            <NumberInput
              label="Grados"
              min={0}
              max={180}
              value={lngDms.deg}
              onValueChange={(deg) => setLngDMS((prevLngDms) => ({ ...prevLngDms, deg }))}
            />
            <NumberInput
              label="Minutos"
              min={0}
              max={59}
              value={lngDms.min}
              onValueChange={(min) => setLngDMS((prevLngDms) => ({ ...prevLngDms, min }))}
            />
            <NumberInput
              label="Segundos"
              min={0}
              max={59.99}
              step={0.01}
              value={lngDms.sec}
              onValueChange={(sec) => setLngDMS((prevLngDms) => ({ ...prevLngDms, sec }))}
            />
            <Select
              label="Dirección"
              defaultSelectedKeys={[lngDms.dir]}
              onChange={(e) => setLngDMS((prevLngDms) => ({ ...prevLngDms, dir: e.target.value }))}
            >
              <SelectItem key="E">Este</SelectItem>
              <SelectItem key="O">Oeste</SelectItem>
            </Select>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="flat" onPress={onClose}>
            Cancelar
          </Button>
          <Button
            color="primary"
            onPress={() => {
              onValueChange({
                lat: dmsToDecimal(latDms.deg, latDms.min, latDms.sec, latDms.dir as 'N' | 'S'),
                lng: dmsToDecimal(lngDms.deg, lngDms.min, lngDms.sec, lngDms.dir as 'E' | 'O'),
              });
              onClose();
            }}
          >
            Aplicar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
