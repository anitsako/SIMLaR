import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react';
import { useState } from 'react';

interface Props {
  title: string;
  label: string;
  textoActual: string;
  isOpen: boolean;
  onClose: () => void;
  onAplicar: (texto: string) => void;
}

export function FiltrarPorTextoModal({ title, label, textoActual, isOpen, onClose, onAplicar }: Props) {
  const [texto, setTexto] = useState(textoActual);

  function handleAplicar() {
    onAplicar(texto.trim());
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalBody>
          <Input
            label={label}
            value={texto}
            onValueChange={setTexto}
            onKeyDown={(e) => e.key === 'Enter' && handleAplicar()}
            autoFocus
          />
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            Cancelar
          </Button>
          <Button color="primary" onPress={handleAplicar}>
            Aplicar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
