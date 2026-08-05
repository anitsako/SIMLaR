import {
  Button,
  Input,
  Select,
  SelectItem,
} from '@heroui/react';
import {
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Search,
  SlidersHorizontal,
} from 'lucide-react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useProyectosMinerosFilterOptions } from './use-proyectos-mineros-filter-options';
import type { FormEvent } from 'react';

import { useProyectosMinerosTipos } from '@/proyectos-mineros-tipos/use-proyectos-mineros-tipos';
import { useProyectosMinerosEtapas } from '@/proyectos-mineros-etapas/use-proyectos-mineros-etapas';

interface Props {
  visibleBase?: boolean;
  mostrarFiltroVisibilidad: boolean;
}

export function ProyectosMinerosFilters({
  visibleBase,
  mostrarFiltroVisibilidad,
}: Props) {
  const {
    nombreLike,
    tiposIds,
    etapasIds,
    minerales,
    ubicaciones,
    propietarios,
    provinciasGeologicas,
    convenioEmse,
    estadoVisible,
    msnmDesde,
    msnmHasta,
  } = useSearch({
    from: '/proyectos-mineros/',
  });

  const navigate = useNavigate({
    from: '/proyectos-mineros/',
  });

  const { data: tipos } = useProyectosMinerosTipos();
  const { data: etapas } = useProyectosMinerosEtapas();

  const { data: opciones } = useProyectosMinerosFilterOptions({
    visible: visibleBase,
  });

  const [nombre, setNombre] = useState(nombreLike ?? '');

  const [tiposSeleccionados, setTiposSeleccionados] =
    useState<Set<string>>(
      new Set((tiposIds ?? []).map(String))
    );

  const [etapasSeleccionadas, setEtapasSeleccionadas] =
    useState<Set<string>>(
      new Set((etapasIds ?? []).map(String))
    );

  const [mineralesSeleccionados, setMineralesSeleccionados] =
    useState<Set<string>>(
      new Set(minerales ?? [])
    );

  const [ubicacionesSeleccionadas, setUbicacionesSeleccionadas] =
    useState<Set<string>>(
      new Set(ubicaciones ?? [])
    );

  const [propietariosSeleccionados, setPropietariosSeleccionados] =
    useState<Set<string>>(
      new Set(propietarios ?? [])
    );

  const [provinciasSeleccionadas, setProvinciasSeleccionadas] =
    useState<Set<string>>(
      new Set(provinciasGeologicas ?? [])
    );

  const [convenio, setConvenio] = useState(
    convenioEmse === undefined
      ? 'todos'
      : convenioEmse
        ? 'si'
        : 'no'
  );

  const [visibilidad, setVisibilidad] = useState(
    estadoVisible === undefined
      ? 'todos'
      : estadoVisible
        ? 'visible'
        : 'oculto'
  );

  const [altitudDesde, setAltitudDesde] = useState(
    msnmDesde?.toString() ?? ''
  );

  const [altitudHasta, setAltitudHasta] = useState(
    msnmHasta?.toString() ?? ''
  );

  const cantidadFiltrosAvanzados =
    (ubicaciones?.length ? 1 : 0) +
    (propietarios?.length ? 1 : 0) +
    (provinciasGeologicas?.length ? 1 : 0) +
    (convenioEmse !== undefined ? 1 : 0) +
    (estadoVisible !== undefined ? 1 : 0) +
    (msnmDesde !== undefined ? 1 : 0) +
    (msnmHasta !== undefined ? 1 : 0);

  const [mostrarAvanzados, setMostrarAvanzados] = useState(
    cantidadFiltrosAvanzados > 0
  );

  /*
   * Sincroniza el formulario con los valores de la URL.
   */
  useEffect(() => {
    setNombre(nombreLike ?? '');
  }, [nombreLike]);

  useEffect(() => {
    setTiposSeleccionados(
      new Set((tiposIds ?? []).map(String))
    );
  }, [tiposIds]);

  useEffect(() => {
    setEtapasSeleccionadas(
      new Set((etapasIds ?? []).map(String))
    );
  }, [etapasIds]);

  useEffect(() => {
    setMineralesSeleccionados(
      new Set(minerales ?? [])
    );
  }, [minerales]);

  useEffect(() => {
    setUbicacionesSeleccionadas(
      new Set(ubicaciones ?? [])
    );
  }, [ubicaciones]);

  useEffect(() => {
    setPropietariosSeleccionados(
      new Set(propietarios ?? [])
    );
  }, [propietarios]);

  useEffect(() => {
    setProvinciasSeleccionadas(
      new Set(provinciasGeologicas ?? [])
    );
  }, [provinciasGeologicas]);

  useEffect(() => {
    setConvenio(
      convenioEmse === undefined
        ? 'todos'
        : convenioEmse
          ? 'si'
          : 'no'
    );
  }, [convenioEmse]);

  useEffect(() => {
    setVisibilidad(
      estadoVisible === undefined
        ? 'todos'
        : estadoVisible
          ? 'visible'
          : 'oculto'
    );
  }, [estadoVisible]);

  useEffect(() => {
    setAltitudDesde(
      msnmDesde?.toString() ?? ''
    );
  }, [msnmDesde]);

  useEffect(() => {
    setAltitudHasta(
      msnmHasta?.toString() ?? ''
    );
  }, [msnmHasta]);

  /*
   * Si existe algún filtro avanzado aplicado,
   * mantiene abierta esa sección.
   */
  useEffect(() => {
    if (cantidadFiltrosAvanzados > 0) {
      setMostrarAvanzados(true);
    }
  }, [cantidadFiltrosAvanzados]);

  const convertirEnteroOpcional = (
    valor: string
  ): number | undefined => {
    if (valor.trim() === '') {
      return undefined;
    }

    const numero = Number(valor);

    if (!Number.isFinite(numero)) {
      return undefined;
    }

    return Math.trunc(numero);
  };

  const aplicarFiltros = (
    event?: FormEvent<HTMLFormElement>
  ) => {
    event?.preventDefault();

    const nuevosTiposIds = Array
      .from(tiposSeleccionados)
      .map(Number)
      .filter(Number.isFinite);

    const nuevasEtapasIds = Array
      .from(etapasSeleccionadas)
      .map(Number)
      .filter(Number.isFinite);

    const nuevoMsnmDesde =
      convertirEnteroOpcional(altitudDesde);

    const nuevoMsnmHasta =
      convertirEnteroOpcional(altitudHasta);

    if (
      nuevoMsnmDesde !== undefined &&
      nuevoMsnmHasta !== undefined &&
      nuevoMsnmDesde > nuevoMsnmHasta
    ) {
      window.alert(
        'La altitud mínima no puede ser mayor que la altitud máxima.'
      );

      return;
    }

    navigate({
      search: (prev) => ({
        ...prev,

        nombreLike:
          nombre.trim() || undefined,

        tiposIds:
          nuevosTiposIds.length > 0
            ? nuevosTiposIds
            : undefined,

        etapasIds:
          nuevasEtapasIds.length > 0
            ? nuevasEtapasIds
            : undefined,

        minerales:
          mineralesSeleccionados.size > 0
            ? Array.from(mineralesSeleccionados)
            : undefined,

        ubicaciones:
          ubicacionesSeleccionadas.size > 0
            ? Array.from(ubicacionesSeleccionadas)
            : undefined,

        propietarios:
          propietariosSeleccionados.size > 0
            ? Array.from(propietariosSeleccionados)
            : undefined,

        provinciasGeologicas:
          provinciasSeleccionadas.size > 0
            ? Array.from(provinciasSeleccionadas)
            : undefined,

        convenioEmse:
          convenio === 'todos'
            ? undefined
            : convenio === 'si',

        estadoVisible:
          !mostrarFiltroVisibilidad ||
          visibilidad === 'todos'
            ? undefined
            : visibilidad === 'visible',

        msnmDesde: nuevoMsnmDesde,
        msnmHasta: nuevoMsnmHasta,

        page: 1,
      }),
    });
  };

  const limpiarFiltros = () => {
    setNombre('');
    setTiposSeleccionados(new Set());
    setEtapasSeleccionadas(new Set());
    setMineralesSeleccionados(new Set());
    setUbicacionesSeleccionadas(new Set());
    setPropietariosSeleccionados(new Set());
    setProvinciasSeleccionadas(new Set());
    setConvenio('todos');
    setVisibilidad('todos');
    setAltitudDesde('');
    setAltitudHasta('');
    setMostrarAvanzados(false);

    navigate({
      search: (prev) => ({
        ...prev,

        nombreLike: undefined,
        tiposIds: undefined,
        etapasIds: undefined,
        minerales: undefined,
        ubicaciones: undefined,
        propietarios: undefined,
        provinciasGeologicas: undefined,
        convenioEmse: undefined,
        estadoVisible: undefined,
        msnmDesde: undefined,
        msnmHasta: undefined,

        page: 1,
      }),
    });
  };

  return (
    <form
      onSubmit={aplicarFiltros}
      className="flex flex-col gap-3"
    >
      {/* Filtros principales */}
      <div
        className="
          grid grid-cols-1 gap-3
          md:grid-cols-2
          xl:grid-cols-[minmax(240px,1.4fr)_minmax(180px,1fr)_minmax(210px,1.1fr)_minmax(190px,1fr)_auto]
          xl:items-end
        "
      >
        <Input
          label="Nombre del proyecto"
          placeholder="Buscar por nombre..."
          value={nombre}
          onValueChange={setNombre}
          variant="bordered"
          size="sm"
          isClearable
          onClear={() => setNombre('')}
        />

        <Select
          label="Tipo de proyecto"
          placeholder="Todos los tipos"
          selectionMode="multiple"
          selectedKeys={tiposSeleccionados}
          variant="bordered"
          size="sm"
          onSelectionChange={(keys) => {
            if (keys === 'all') {
              setTiposSeleccionados(
                new Set(
                  tipos.map((tipo) =>
                    String(tipo.id)
                  )
                )
              );

              return;
            }

            setTiposSeleccionados(
              new Set(
                Array.from(keys).map(String)
              )
            );
          }}
        >
          {tipos.map((tipo) => (
            <SelectItem key={String(tipo.id)}>
              {tipo.nombre}
            </SelectItem>
          ))}
        </Select>

        <Select
          label="Etapa del proyecto"
          placeholder="Todas las etapas"
          selectionMode="multiple"
          selectedKeys={etapasSeleccionadas}
          variant="bordered"
          size="sm"
          onSelectionChange={(keys) => {
            if (keys === 'all') {
              setEtapasSeleccionadas(
                new Set(
                  etapas.map((etapa) =>
                    String(etapa.id)
                  )
                )
              );

              return;
            }

            setEtapasSeleccionadas(
              new Set(
                Array.from(keys).map(String)
              )
            );
          }}
        >
          {etapas.map((etapa) => (
            <SelectItem key={String(etapa.id)}>
              {etapa.nombre}
            </SelectItem>
          ))}
        </Select>

        <Select
          label="Mineral de interés"
          placeholder="Todos los minerales"
          selectionMode="multiple"
          selectedKeys={mineralesSeleccionados}
          variant="bordered"
          size="sm"
          onSelectionChange={(keys) => {
            if (keys === 'all') {
              setMineralesSeleccionados(
                new Set(opciones.minerales)
              );

              return;
            }

            setMineralesSeleccionados(
              new Set(
                Array.from(keys).map(String)
              )
            );
          }}
        >
          {opciones.minerales.map((mineral) => (
            <SelectItem key={mineral}>
              {mineral}
            </SelectItem>
          ))}
        </Select>

        <Button
          type="submit"
          color="primary"
          startContent={<Search size={17} />}
          className="w-full xl:w-auto"
        >
          Aplicar
        </Button>
      </div>

      {/* Controles secundarios */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Button
          type="button"
          variant="light"
          startContent={
            <SlidersHorizontal size={17} />
          }
          endContent={
            mostrarAvanzados
              ? <ChevronUp size={16} />
              : <ChevronDown size={16} />
          }
          onPress={() =>
            setMostrarAvanzados((actual) => !actual)
          }
        >
          {cantidadFiltrosAvanzados > 0
            ? `Más filtros (${cantidadFiltrosAvanzados})`
            : 'Más filtros'}
        </Button>

        <Button
          type="button"
          variant="flat"
          startContent={<RotateCcw size={17} />}
          onPress={limpiarFiltros}
        >
          Limpiar filtros
        </Button>
      </div>

      {/* Filtros avanzados */}
      {mostrarAvanzados && (
        <div
          className="
            rounded-xl border border-default-200
            bg-default-50/50 p-3
          "
        >
          <div
            className="
              mb-3 flex items-center justify-between
            "
          >
            <div>
              <h3 className="text-sm font-semibold">
                Filtros avanzados
              </h3>

              <p className="text-xs text-default-500">
                Podés combinar estos criterios con los filtros principales.
              </p>
            </div>
          </div>

          <div
            className="
              grid grid-cols-1 gap-3
              md:grid-cols-2
              xl:grid-cols-4
            "
          >
            <Select
              label="Ubicación"
              placeholder="Todas las ubicaciones"
              selectionMode="multiple"
              selectedKeys={ubicacionesSeleccionadas}
              variant="bordered"
              size="sm"
              onSelectionChange={(keys) => {
                if (keys === 'all') {
                  setUbicacionesSeleccionadas(
                    new Set(opciones.ubicaciones)
                  );

                  return;
                }

                setUbicacionesSeleccionadas(
                  new Set(
                    Array.from(keys).map(String)
                  )
                );
              }}
            >
              {opciones.ubicaciones.map((ubicacion) => (
                <SelectItem key={ubicacion}>
                  {ubicacion}
                </SelectItem>
              ))}
            </Select>

            <Select
              label="Propietario"
              placeholder="Todos los propietarios"
              selectionMode="multiple"
              selectedKeys={propietariosSeleccionados}
              variant="bordered"
              size="sm"
              onSelectionChange={(keys) => {
                if (keys === 'all') {
                  setPropietariosSeleccionados(
                    new Set(opciones.propietarios)
                  );

                  return;
                }

                setPropietariosSeleccionados(
                  new Set(
                    Array.from(keys).map(String)
                  )
                );
              }}
            >
              {opciones.propietarios.map((propietario) => (
                <SelectItem key={propietario}>
                  {propietario}
                </SelectItem>
              ))}
            </Select>

            <Select
              label="Provincia geológica"
              placeholder="Todas las provincias geológicas"
              selectionMode="multiple"
              selectedKeys={provinciasSeleccionadas}
              variant="bordered"
              size="sm"
              onSelectionChange={(keys) => {
                if (keys === 'all') {
                  setProvinciasSeleccionadas(
                    new Set(
                      opciones.provinciasGeologicas
                    )
                  );

                  return;
                }

                setProvinciasSeleccionadas(
                  new Set(
                    Array.from(keys).map(String)
                  )
                );
              }}
            >
              {opciones.provinciasGeologicas.map(
                (provincia) => (
                  <SelectItem key={provincia}>
                    {provincia}
                  </SelectItem>
                )
              )}
            </Select>

            <Select
              label="Convenio EMSE"
              selectedKeys={new Set([convenio])}
              variant="bordered"
              size="sm"
              onSelectionChange={(keys) => {
                if (keys === 'all') {
                  return;
                }

                setConvenio(
                  String(
                    Array.from(keys)[0] ?? 'todos'
                  )
                );
              }}
            >
              <SelectItem key="todos">
                Con o sin convenio
              </SelectItem>

              <SelectItem key="si">
                Con convenio EMSE
              </SelectItem>

              <SelectItem key="no">
                Sin convenio EMSE
              </SelectItem>
            </Select>

            {mostrarFiltroVisibilidad && (
              <Select
                label="Visibilidad"
                selectedKeys={new Set([visibilidad])}
                variant="bordered"
                size="sm"
                onSelectionChange={(keys) => {
                  if (keys === 'all') {
                    return;
                  }

                  setVisibilidad(
                    String(
                      Array.from(keys)[0] ??
                        'todos'
                    )
                  );
                }}
              >
                <SelectItem key="todos">
                  Cualquier visibilidad
                </SelectItem>

                <SelectItem key="visible">
                  Visible
                </SelectItem>

                <SelectItem key="oculto">
                  No visible
                </SelectItem>
              </Select>
            )}

            <Input
              type="number"
              label="Altitud mínima"
              placeholder="Metros sobre el nivel del mar"
              value={altitudDesde}
              onValueChange={setAltitudDesde}
              variant="bordered"
              size="sm"
            />

            <Input
              type="number"
              label="Altitud máxima"
              placeholder="Metros sobre el nivel del mar"
              value={altitudHasta}
              onValueChange={setAltitudHasta}
              variant="bordered"
              size="sm"
            />
          </div>
        </div>
      )}
    </form>
  );
}