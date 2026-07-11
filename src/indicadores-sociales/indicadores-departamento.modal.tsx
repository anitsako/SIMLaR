import {
  Alert,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Skeleton,
  Textarea,
  addToast,
} from '@heroui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { useEffect, useState } from 'react';

import {OcupacionCategoriaEditor, crearFilasOcupacionCategoria,} from './ocupacion-categoria.editor';

import {PoblacionEdadSexoEditor, crearFilasPoblacionEdadSexo,} from './poblacion-edad-sexo.editor';

import { saveIndicadoresDepartamentoFn } from './save-indicadores-departamento.fn';
import { useIndicadoresDepartamento } from './use-indicadores-departamento';
import type { FilaPoblacionEdadSexoFormulario } from './poblacion-edad-sexo.editor';
import type { FilaOcupacionCategoriaFormulario } from './ocupacion-categoria.editor';
import type { FormEvent } from 'react';

type DepartamentoSeleccionado = {
  id: number;
  nombre: string;
};

type FormularioIndicadores = {
  poblacion2010: string;
  poblacion2022: string;
  mujeres2022: string;
  varones2022: string;
  edadMedianaTotal: string;
  edadMedianaMujeres: string;
  edadMedianaVarones: string;
  poblacionPorEdadSexo: Array<FilaPoblacionEdadSexoFormulario>;
  ocupacionPorCategoria: Array<FilaOcupacionCategoriaFormulario>;
  fuente: string;
  observaciones: string;
};

type CampoTextoFormulario = Exclude<
  keyof FormularioIndicadores,
  'poblacionPorEdadSexo' | 'ocupacionPorCategoria'
>;

type IndicadoresDepartamentoModalProps = {
  isOpen: boolean;
  departamento: DepartamentoSeleccionado | null;
  onClose: () => void;
};

const getFormularioVacio = (): FormularioIndicadores => ({
  poblacion2010: '',
  poblacion2022: '',
  mujeres2022: '',
  varones2022: '',
  edadMedianaTotal: '',
  edadMedianaMujeres: '',
  edadMedianaVarones: '',
  poblacionPorEdadSexo: crearFilasPoblacionEdadSexo(),
  ocupacionPorCategoria: crearFilasOcupacionCategoria(),
  fuente:
    'INDEC - Censo Nacional de Población, Hogares y Viviendas 2022',
  observaciones: '',
});

const numeroAString = (
  valor: number | null | undefined
): string => {
  if (valor === null || valor === undefined) {
    return '';
  }

  return String(valor);
};

const parseNumeroOpcional = (
  valor: string,
  nombreCampo: string,
  entero: boolean
): number | null => {
  const valorLimpio = valor.trim();

  if (valorLimpio.length === 0) {
    return null;
  }

  const numero = Number(valorLimpio.replace(',', '.'));

  if (!Number.isFinite(numero) || numero < 0) {
    throw new Error(
      `${nombreCampo} debe ser un número válido mayor o igual a cero.`
    );
  }

  if (entero && !Number.isInteger(numero)) {
    throw new Error(
      `${nombreCampo} debe ser un número entero.`
    );
  }

  return numero;
};

const parsePoblacionPorEdadSexo = (
  filas: Array<FilaPoblacionEdadSexoFormulario>
) => {
  const filasConDatos = filas.filter(
    (fila) =>
      fila.mujeres.trim().length > 0 ||
      fila.varones.trim().length > 0
  );

  if (filasConDatos.length === 0) {
    return [];
  }

  return filasConDatos.map((fila) => {
    const mujeresTexto = fila.mujeres.trim();
    const varonesTexto = fila.varones.trim();

    if (
      mujeresTexto.length === 0 ||
      varonesTexto.length === 0
    ) {
      throw new Error(
        `Completá mujeres y varones para el grupo ${fila.grupoEdad}.`
      );
    }

    const mujeres = Number(mujeresTexto);
    const varones = Number(varonesTexto);

    if (
      !Number.isInteger(mujeres) ||
      mujeres < 0 ||
      !Number.isInteger(varones) ||
      varones < 0
    ) {
      throw new Error(
        `Los datos del grupo ${fila.grupoEdad} deben ser números enteros mayores o iguales a cero.`
      );
    }

    return {
      grupoEdad: fila.grupoEdad,
      mujeres,
      varones,
    };
  });
};

const parseOcupacionPorCategoria = (
  filas: Array<FilaOcupacionCategoriaFormulario>
) => {
  const filasConDatos = filas.filter(
    (fila) =>
      fila.mujeres.trim().length > 0 ||
      fila.varones.trim().length > 0
  );

  if (filasConDatos.length === 0) {
    return [];
  }

  return filasConDatos.map((fila) => {
    const mujeresTexto = fila.mujeres.trim();
    const varonesTexto = fila.varones.trim();

    if (
      mujeresTexto.length === 0 ||
      varonesTexto.length === 0
    ) {
      throw new Error(
        `Completá mujeres y varones para la categoría ${fila.categoria}.`
      );
    }

    const mujeres = Number(mujeresTexto);
    const varones = Number(varonesTexto);

    if (
      !Number.isInteger(mujeres) ||
      mujeres < 0 ||
      !Number.isInteger(varones) ||
      varones < 0
    ) {
      throw new Error(
        `Los valores de ${fila.categoria} deben ser números enteros mayores o iguales a cero.`
      );
    }

    return {
      categoria: fila.categoria,
      mujeres,
      varones,
    };
  });
};

export function IndicadoresDepartamentoModal({
  isOpen,
  departamento,
  onClose,
}: IndicadoresDepartamentoModalProps) {
  const queryClient = useQueryClient();

  const [formulario, setFormulario] =
    useState<FormularioIndicadores>(getFormularioVacio);

  const [validationError, setValidationError] =
    useState<string | null>(null);

  const {
    data: indicadores,
    isLoading,
    error: queryError,
  } = useIndicadoresDepartamento(
    departamento?.id ?? null
  );

  const saveIndicadores = useServerFn(
    saveIndicadoresDepartamentoFn
  );

  const saveMutation = useMutation({
    mutationFn: saveIndicadores,

    onSuccess: async () => {
      if (!departamento) {
        return;
      }

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['departamentos-indicadores'],
        }),

        queryClient.invalidateQueries({
          queryKey: [
            'indicadores-departamento',
            departamento.id,
          ],
        }),
      ]);

      setValidationError(null);

      addToast({
        title: 'Indicadores guardados',
        description: `Los datos de ${departamento.nombre} fueron guardados correctamente.`,
        color: 'success',
        variant: 'solid',
      });

      onClose();
    },

    onError: (error) => {
      const mensaje =
        error instanceof Error
          ? error.message
          : 'No se pudieron guardar los indicadores.';

      setValidationError(mensaje);

      addToast({
        title: 'No se pudieron guardar los indicadores',
        description: mensaje,
        color: 'danger',
        variant: 'solid',
      });
    },
  });

  /*
   * Limpiar el formulario cuando se abre el modal
   * o cuando cambia el departamento seleccionado.
   */
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setFormulario(getFormularioVacio());
    setValidationError(null);
  }, [departamento?.id, isOpen]);

  /*
   * Cargar en el formulario los datos existentes
   * cuando se edita un departamento.
   */
  useEffect(() => {
    if (!isOpen || !indicadores) {
      return;
    }

    const datosPorGrupo = new Map(
      indicadores.poblacionPorEdadSexo.map(
        (fila) => [fila.grupoEdad, fila]
      )
    );

    const poblacionPorEdadSexo =
      crearFilasPoblacionEdadSexo().map((fila) => {
        const filaGuardada = datosPorGrupo.get(
          fila.grupoEdad
        );

        return {
          grupoEdad: fila.grupoEdad,
          mujeres: numeroAString(
            filaGuardada?.mujeres
          ),
          varones: numeroAString(
            filaGuardada?.varones
          ),
        };
      });

    const datosPorCategoria = new Map(
      indicadores.ocupacionPorCategoria.map(
        (fila) => [fila.categoria, fila]
      )
    );

    const ocupacionPorCategoria =
      crearFilasOcupacionCategoria().map((fila) => {
        const filaGuardada = datosPorCategoria.get(
          fila.categoria
        );

        return {
          categoria: fila.categoria,
          mujeres: numeroAString(
            filaGuardada?.mujeres
          ),
          varones: numeroAString(
            filaGuardada?.varones
          ),
        };
      });

    setFormulario({
      poblacion2010: numeroAString(
        indicadores.poblacion2010
      ),

      poblacion2022: numeroAString(
        indicadores.poblacion2022
      ),

      mujeres2022: numeroAString(
        indicadores.mujeres2022
      ),

      varones2022: numeroAString(
        indicadores.varones2022
      ),

      edadMedianaTotal: numeroAString(
        indicadores.edadMedianaTotal
      ),

      edadMedianaMujeres: numeroAString(
        indicadores.edadMedianaMujeres
      ),

      edadMedianaVarones: numeroAString(
        indicadores.edadMedianaVarones
      ),

      poblacionPorEdadSexo,

      ocupacionPorCategoria,

      fuente: indicadores.fuente,

      observaciones:
        indicadores.observaciones ?? '',
    });
  }, [indicadores, isOpen]);

  const actualizarCampo =
    (campo: CampoTextoFormulario) =>
    (valor: string) => {
      setFormulario((anterior) => ({
        ...anterior,
        [campo]: valor,
      }));
    };

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!departamento) {
      return;
    }

    setValidationError(null);

    try {
      const poblacion2010 = parseNumeroOpcional(
        formulario.poblacion2010,
        'Población 2010',
        true
      );

      const poblacion2022 = parseNumeroOpcional(
        formulario.poblacion2022,
        'Población 2022',
        true
      );

      const mujeres2022 = parseNumeroOpcional(
        formulario.mujeres2022,
        'Mujeres 2022',
        true
      );

      const varones2022 = parseNumeroOpcional(
        formulario.varones2022,
        'Varones 2022',
        true
      );

      const edadMedianaTotal = parseNumeroOpcional(
        formulario.edadMedianaTotal,
        'Edad mediana total',
        false
      );

      const edadMedianaMujeres =
        parseNumeroOpcional(
          formulario.edadMedianaMujeres,
          'Edad mediana de mujeres',
          false
        );

      const edadMedianaVarones =
        parseNumeroOpcional(
          formulario.edadMedianaVarones,
          'Edad mediana de varones',
          false
        );

      const poblacionPorEdadSexo =
        parsePoblacionPorEdadSexo(
          formulario.poblacionPorEdadSexo
        );

      const ocupacionPorCategoria =
        parseOcupacionPorCategoria(
          formulario.ocupacionPorCategoria
        );

      const fuente = formulario.fuente.trim();

      if (fuente.length === 0) {
        throw new Error('La fuente es obligatoria.');
      }

      /*
       * La población total 2022 debe coincidir
       * con la suma de mujeres y varones.
       */
      if (
        poblacion2022 !== null &&
        mujeres2022 !== null &&
        varones2022 !== null &&
        mujeres2022 + varones2022 !== poblacion2022
      ) {
        throw new Error(
          'La suma de mujeres y varones debe coincidir con la población 2022.'
        );
      }

      /*
       * Validar que las sumas por grupos de edad
       * coincidan con los totales generales.
       */
      if (poblacionPorEdadSexo.length > 0) {
        const totalMujeresPorEdad =
          poblacionPorEdadSexo.reduce(
            (total, fila) => total + fila.mujeres,
            0
          );

        const totalVaronesPorEdad =
          poblacionPorEdadSexo.reduce(
            (total, fila) => total + fila.varones,
            0
          );

        if (
          mujeres2022 !== null &&
          totalMujeresPorEdad !== mujeres2022
        ) {
          throw new Error(
            `La suma de mujeres por edad es ${totalMujeresPorEdad}, pero el total de mujeres 2022 es ${mujeres2022}.`
          );
        }

        if (
          varones2022 !== null &&
          totalVaronesPorEdad !== varones2022
        ) {
          throw new Error(
            `La suma de varones por edad es ${totalVaronesPorEdad}, pero el total de varones 2022 es ${varones2022}.`
          );
        }
      }

      saveMutation.mutate({
        data: {
          departamentoId: departamento.id,

          poblacion2010,
          poblacion2022,

          mujeres2022,
          varones2022,

          edadMedianaTotal,
          edadMedianaMujeres,
          edadMedianaVarones,

          poblacionPorEdadSexo,

          ocupacionPorCategoria,

          /*
           * Este conjunto de datos todavía no tiene
           * editor, por eso se conserva lo existente.
           */
          ocupacionPorEdadSexo:
            indicadores?.ocupacionPorEdadSexo ?? [],

          fuente,

          observaciones:
            formulario.observaciones.trim().length > 0
              ? formulario.observaciones.trim()
              : null,
        },
      });
    } catch (error) {
      setValidationError(
        error instanceof Error
          ? error.message
          : 'Revisá los datos ingresados.'
      );
    }
  };

  const tituloModal = indicadores
    ? 'Editar indicadores'
    : 'Cargar indicadores';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="5xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <span>{tituloModal}</span>

          <span className="text-base font-normal text-default-500">
            {departamento?.nombre}
          </span>
        </ModalHeader>

        <ModalBody>
          {isLoading ? (
            <Skeleton className="h-90 w-full rounded-xl" />
          ) : (
            <form
              id="form-indicadores-departamento"
              className="space-y-6"
              onSubmit={handleSubmit}
            >
              <section className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold">
                    Población
                  </h2>

                  <p className="text-sm text-default-500">
                    Datos generales de los censos 2010 y
                    2022.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Input
                    label="Población 2010"
                    value={formulario.poblacion2010}
                    onValueChange={actualizarCampo(
                      'poblacion2010'
                    )}
                    inputMode="numeric"
                    placeholder="Ejemplo: 9184"
                  />

                  <Input
                    label="Población 2022"
                    value={formulario.poblacion2022}
                    onValueChange={actualizarCampo(
                      'poblacion2022'
                    )}
                    inputMode="numeric"
                    placeholder="Ejemplo: 11176"
                  />

                  <Input
                    label="Mujeres 2022"
                    value={formulario.mujeres2022}
                    onValueChange={actualizarCampo(
                      'mujeres2022'
                    )}
                    inputMode="numeric"
                    placeholder="Ejemplo: 5721"
                  />

                  <Input
                    label="Varones 2022"
                    value={formulario.varones2022}
                    onValueChange={actualizarCampo(
                      'varones2022'
                    )}
                    inputMode="numeric"
                    placeholder="Ejemplo: 5455"
                  />
                </div>
              </section>

              <section className="space-y-4 border-t border-default-200 pt-5">
                <div>
                  <h2 className="text-lg font-semibold">
                    Edad mediana
                  </h2>

                  <p className="text-sm text-default-500">
                    Podés ingresar números decimales con punto
                    o coma.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <Input
                    label="Edad mediana total"
                    value={formulario.edadMedianaTotal}
                    onValueChange={actualizarCampo(
                      'edadMedianaTotal'
                    )}
                    inputMode="decimal"
                    placeholder="Ejemplo: 31,2"
                  />

                  <Input
                    label="Edad mediana de mujeres"
                    value={formulario.edadMedianaMujeres}
                    onValueChange={actualizarCampo(
                      'edadMedianaMujeres'
                    )}
                    inputMode="decimal"
                    placeholder="Ejemplo: 32,1"
                  />

                  <Input
                    label="Edad mediana de varones"
                    value={formulario.edadMedianaVarones}
                    onValueChange={actualizarCampo(
                      'edadMedianaVarones'
                    )}
                    inputMode="decimal"
                    placeholder="Ejemplo: 30,4"
                  />
                </div>
              </section>

              <PoblacionEdadSexoEditor
                value={
                  formulario.poblacionPorEdadSexo
                }
                onChange={(poblacionPorEdadSexo) =>
                  setFormulario((anterior) => ({
                    ...anterior,
                    poblacionPorEdadSexo,
                  }))
                }
              />

              <OcupacionCategoriaEditor
                value={
                  formulario.ocupacionPorCategoria
                }
                onChange={(ocupacionPorCategoria) =>
                  setFormulario((anterior) => ({
                    ...anterior,
                    ocupacionPorCategoria,
                  }))
                }
              />

              <section className="space-y-4 border-t border-default-200 pt-5">
                <div>
                  <h2 className="text-lg font-semibold">
                    Fuente y observaciones
                  </h2>
                </div>

                <Input
                  label="Fuente"
                  value={formulario.fuente}
                  onValueChange={actualizarCampo(
                    'fuente'
                  )}
                  isRequired
                />

                <Textarea
                  label="Observaciones"
                  value={formulario.observaciones}
                  onValueChange={actualizarCampo(
                    'observaciones'
                  )}
                  minRows={3}
                  placeholder="Información adicional, aclaraciones o referencias del cuadro del INDEC."
                />
              </section>

              {validationError ? (
                <Alert color="danger">
                  {validationError}
                </Alert>
              ) : null}

              {queryError ? (
                <Alert color="danger">
                  Error al consultar los indicadores:{' '}
                  {queryError.message}
                </Alert>
              ) : null}

              {saveMutation.error ? (
                <Alert color="danger">
                  Error al guardar los indicadores:{' '}
                  {saveMutation.error.message}
                </Alert>
              ) : null}
            </form>
          )}
        </ModalBody>

        <ModalFooter>
          <Button
            variant="flat"
            onPress={onClose}
            isDisabled={saveMutation.isPending}
          >
            Cancelar
          </Button>

          <Button
            type="button"
            color="primary"
            isLoading={saveMutation.isPending}
            isDisabled={
              isLoading || departamento === null
            }
            onPress={() => {
              const formularioElemento =
                document.getElementById(
                  'form-indicadores-departamento'
                );

              if (
                formularioElemento instanceof
                HTMLFormElement
              ) {
                formularioElemento.requestSubmit();
              }
            }}
          >
            Guardar indicadores
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}