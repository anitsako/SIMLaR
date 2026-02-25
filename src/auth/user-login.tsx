import {
  Alert,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@heroui/react';
import { useMutation } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { useState } from 'react';
import { CircleUserRound } from 'lucide-react';
import { loginFn } from './login.fn';

export const UserLogin = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const login = useServerFn(loginFn);
  const { mutate, isPending } = useMutation({ mutationFn: login });

  const handleLogin = () => {
    setError(null);
    mutate(
      { data: { username, password } },
      {
        onSuccess: (result) => {
          setError(result.error);
        },
      }
    );
  };

  const handleClose = () => {
    setUsername('');
    setPassword('');
    setError(null);
    onClose();
  };

  return (
    <>
      <Button color="primary" startContent={<CircleUserRound />} onPress={onOpen}>
        Ingresar
      </Button>

      <Modal isOpen={isOpen} onClose={handleClose} placement="center">
        <ModalContent>
          <ModalHeader>Iniciar sesión</ModalHeader>
          <ModalBody>
            {error && <Alert color="danger" title={error} />}
            <Input label="Usuario" value={username} onValueChange={setUsername} />
            <Input
              label="Contraseña"
              type="password"
              value={password}
              onValueChange={setPassword}
              onKeyDown={(e) => {
                e.key === 'Enter' && handleLogin();
              }}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={handleClose}>
              Cancelar
            </Button>
            <Button color="primary" isLoading={isPending} onPress={handleLogin}>
              Ingresar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
