import { useState } from 'react';
import { useDisclosure } from '@heroui/react';
import { BookOpenText } from 'lucide-react';
import { useMetaliferos } from '@/metaliferos/use-metaliferos';
import { MetaliferoModal } from '@/metaliferos/metalifero-modal';

export const ModalTablaProyectos = () => {
  const { data: metaliferos } = useMetaliferos();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedId, setSelectedId] = useState<number | null>(null);

    if(!metaliferos) return null;

    return (
        <> 
            {metaliferos.map((metalifero) => (
                <div key={metalifero.id}>
                    <a className='cursor-pointer inline-block w-fit h-fit' onClick={() => { setSelectedId(metalifero.id); onOpen(); }}>
                        <BookOpenText className='w-6 h-6 opacity-60' />
                    </a>
                    <MetaliferoModal id={selectedId} isOpen={isOpen} onClose={onClose}></MetaliferoModal>
                </div>
            ))}
        </>
    )
}