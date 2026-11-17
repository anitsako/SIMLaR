import { useEffect } from 'react';
import { Button, ButtonGroup } from '@heroui/react';
import { useTranslation } from 'react-i18next';

type Idioma = 'es' | 'en';

export function SelectorIdioma() {
  const { i18n } = useTranslation();

  // Recupera el idioma elegido la última vez
  useEffect(() => {
    const guardado = localStorage.getItem('idioma') as Idioma | null;
    if (guardado && guardado !== i18n.language) cambiar(guardado);
  }, []);

  const cambiar = (idioma: Idioma) => {
    i18n.changeLanguage(idioma);
    localStorage.setItem('idioma', idioma);
    document.documentElement.lang = idioma;
  };

  return (
    <ButtonGroup size="sm" variant="light">
      {(['es', 'en'] as const).map((idioma) => (
        <Button
          key={idioma}
          onPress={() => cambiar(idioma)}
          className={i18n.language === idioma ? 'font-bold text-danger' : 'text-default-500'}
          aria-label={idioma === 'es' ? 'Español' : 'English'}
        >
          {idioma.toUpperCase()}
        </Button>
      ))}
    </ButtonGroup>
  );
}
