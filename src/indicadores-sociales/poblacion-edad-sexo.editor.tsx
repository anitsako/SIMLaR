import { Input } from '@heroui/react';
import { useTranslation } from 'react-i18next';

export type FilaPoblacionEdadSexoFormulario = {
  grupoEdad: string;
  mujeres: string;
  varones: string;
};

const gruposEdad = [
  '0 a 4',
  '5 a 9',
  '10 a 14',
  '15 a 19',
  '20 a 24',
  '25 a 29',
  '30 a 34',
  '35 a 39',
  '40 a 44',
  '45 a 49',
  '50 a 54',
  '55 a 59',
  '60 a 64',
  '65 a 69',
  '70 a 74',
  '75 a 79',
  '80 a 84',
  '85 a 89',
  '90 a 94',
  '95 a 99',
  '100 años y más',
];

export const crearFilasPoblacionEdadSexo =
  (): Array<FilaPoblacionEdadSexoFormulario> =>
    gruposEdad.map((grupoEdad) => ({
      grupoEdad,
      mujeres: '',
      varones: '',
    }));

type PoblacionEdadSexoEditorProps = {
  value: Array<FilaPoblacionEdadSexoFormulario>;
  onChange: (
    filas: Array<FilaPoblacionEdadSexoFormulario>
  ) => void;
};

const calcularIndiceFeminidad = (
  mujeresTexto: string,
  varonesTexto: string
): string => {
  if (
    mujeresTexto.trim().length === 0 ||
    varonesTexto.trim().length === 0
  ) {
    return '—';
  }

  const mujeres = Number(mujeresTexto);
  const varones = Number(varonesTexto);

  if (
    !Number.isFinite(mujeres) ||
    !Number.isFinite(varones) ||
    varones === 0
  ) {
    return '—';
  }

  return ((mujeres / varones) * 100).toLocaleString(
    'es-AR',
    {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }
  );
};

export function PoblacionEdadSexoEditor({
  value,
  onChange,
}: PoblacionEdadSexoEditorProps) {
  const { t } = useTranslation();
  const actualizarFila = (
    indice: number,
    campo: 'mujeres' | 'varones',
    nuevoValor: string
  ) => {
    const valorNumerico = nuevoValor.replace(/[^\d]/g, '');

    onChange(
      value.map((fila, filaIndice) =>
        filaIndice === indice
          ? {
              ...fila,
              [campo]: valorNumerico,
            }
          : fila
      )
    );
  };

  return (
    <section className="space-y-4 border-t border-default-200 pt-5">
      <div>
        <h2 className="text-lg font-semibold">
          {t('routes.admin.indicadoresSociales.edadSexo.titulo')}
        </h2>

        <p className="text-sm text-default-500">
          {t('routes.admin.indicadoresSociales.edadSexo.descripcion')}
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-default-200">
        <div className="min-w-170">
          <div className="grid grid-cols-[1.3fr_1fr_1fr_1fr] items-center gap-3 bg-default-100 px-4 py-3 text-sm font-semibold">
            <span>{t('routes.admin.indicadoresSociales.edadSexo.grupoEdad')}</span>
            <span className="text-center">{t('routes.admin.indicadoresSociales.edadSexo.mujeres')}</span>
            <span className="text-center">{t('routes.admin.indicadoresSociales.edadSexo.varones')}</span>
            <span className="text-center">
              {t('routes.admin.indicadoresSociales.edadSexo.indiceFeminidad')}
            </span>
          </div>

          {value.map((fila, indice) => (
            <div
              key={fila.grupoEdad}
              className="grid grid-cols-[1.3fr_1fr_1fr_1fr] items-center gap-3 border-t border-default-200 px-4 py-2"
            >
              <span className="text-sm font-medium">
                {fila.grupoEdad}
              </span>

              <Input
                aria-label={t('routes.admin.indicadoresSociales.edadSexo.mujeresAria', { grupo: fila.grupoEdad })}
                size="sm"
                variant="bordered"
                value={fila.mujeres}
                onValueChange={(valor) =>
                  actualizarFila(indice, 'mujeres', valor)
                }
                inputMode="numeric"
                placeholder="0"
                classNames={{
                  input: 'text-right',
                }}
              />

              <Input
                aria-label={t('routes.admin.indicadoresSociales.edadSexo.varonesAria', { grupo: fila.grupoEdad })}
                size="sm"
                variant="bordered"
                value={fila.varones}
                onValueChange={(valor) =>
                  actualizarFila(indice, 'varones', valor)
                }
                inputMode="numeric"
                placeholder="0"
                classNames={{
                  input: 'text-right',
                }}
              />

              <div className="text-center">
                <span className="font-semibold">
                  {calcularIndiceFeminidad(
                    fila.mujeres,
                    fila.varones
                  )}
                </span>

                <span className="ml-1 text-xs text-default-500">
                  {t('routes.admin.indicadoresSociales.edadSexo.mujeresCada100')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-default-500">
        {t('routes.admin.indicadoresSociales.edadSexo.ayuda')}
      </p>
    </section>
  );
}