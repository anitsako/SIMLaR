import { Input } from '@heroui/react';
import { useTranslation } from 'react-i18next';

export type FilaOcupacionCategoriaFormulario = {
  categoria: string;
  mujeres: string;
  varones: string;
};

const categoriasOcupacionales = [
  'Obrero/a o empleado/a',
  'Patrón/a',
  'Trabajador/a por cuenta propia',
  'Trabajador/a familiar',
];

// Los valores de arriba se guardan en la base; estas claves son solo para mostrarlos.
const CLAVES_CATEGORIA: Record<string, string> = {
  'Obrero/a o empleado/a': 'routes.admin.indicadoresSociales.ocupacion.categorias.obrero',
  'Patrón/a': 'routes.admin.indicadoresSociales.ocupacion.categorias.patron',
  'Trabajador/a por cuenta propia': 'routes.admin.indicadoresSociales.ocupacion.categorias.cuentaPropia',
  'Trabajador/a familiar': 'routes.admin.indicadoresSociales.ocupacion.categorias.familiar',
};

export const crearFilasOcupacionCategoria =
  (): Array<FilaOcupacionCategoriaFormulario> =>
    categoriasOcupacionales.map((categoria) => ({
      categoria,
      mujeres: '',
      varones: '',
    }));

type OcupacionCategoriaEditorProps = {
  value: Array<FilaOcupacionCategoriaFormulario>;
  onChange: (
    filas: Array<FilaOcupacionCategoriaFormulario>
  ) => void;
};

const formatearNumero = (valor: number): string =>
  valor.toLocaleString('es-AR');

export function OcupacionCategoriaEditor({
  value,
  onChange,
}: OcupacionCategoriaEditorProps) {
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
          {t('routes.admin.indicadoresSociales.ocupacion.titulo')}
        </h2>

        <p className="text-sm text-default-500">
          {t('routes.admin.indicadoresSociales.ocupacion.descripcion')}
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-default-200">
        <div className="min-w-162.5">
          <div className="grid grid-cols-[1.6fr_1fr_1fr_1fr] items-center gap-3 bg-default-100 px-4 py-3 text-sm font-semibold">
            <span>{t('routes.admin.indicadoresSociales.ocupacion.categoria')}</span>
            <span className="text-center">{t('routes.admin.indicadoresSociales.ocupacion.mujeres')}</span>
            <span className="text-center">{t('routes.admin.indicadoresSociales.ocupacion.varones')}</span>
            <span className="text-center">{t('routes.admin.indicadoresSociales.ocupacion.total')}</span>
          </div>

          {value.map((fila, indice) => {
            const mujeres =
              fila.mujeres.length > 0
                ? Number(fila.mujeres)
                : 0;

            const varones =
              fila.varones.length > 0
                ? Number(fila.varones)
                : 0;

            const total = mujeres + varones;
            const etiqueta = CLAVES_CATEGORIA[fila.categoria]
              ? t(CLAVES_CATEGORIA[fila.categoria])
              : fila.categoria;

            return (
              <div
                key={fila.categoria}
                className="grid grid-cols-[1.6fr_1fr_1fr_1fr] items-center gap-3 border-t border-default-200 px-4 py-2"
              >
                <span className="text-sm font-medium">
                  {etiqueta}
                </span>

                <Input
                  aria-label={t('routes.admin.indicadoresSociales.ocupacion.mujeresAria', { categoria: etiqueta })}
                  size="sm"
                  variant="bordered"
                  value={fila.mujeres}
                  onValueChange={(valor) =>
                    actualizarFila(
                      indice,
                      'mujeres',
                      valor
                    )
                  }
                  inputMode="numeric"
                  placeholder="0"
                  classNames={{
                    input: 'text-right',
                  }}
                />

                <Input
                  aria-label={t('routes.admin.indicadoresSociales.ocupacion.varonesAria', { categoria: etiqueta })}
                  size="sm"
                  variant="bordered"
                  value={fila.varones}
                  onValueChange={(valor) =>
                    actualizarFila(
                      indice,
                      'varones',
                      valor
                    )
                  }
                  inputMode="numeric"
                  placeholder="0"
                  classNames={{
                    input: 'text-right',
                  }}
                />

                <div className="text-center font-semibold">
                  {total > 0
                    ? formatearNumero(total)
                    : '—'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-xs text-default-500">
        {t('routes.admin.indicadoresSociales.ocupacion.ayuda')}
      </p>
    </section>
  );
}