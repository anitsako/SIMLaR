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
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import type { FormEvent, Key } from 'react';

import { useProyectosMinerosTipos } from '@/proyectos-mineros-tipos/use-proyectos-mineros-tipos';
import { useProyectosMinerosEtapas } from '@/proyectos-mineros-etapas/use-proyectos-mineros-etapas';
import { useProyectosMinerosFilterOptions } from './use-proyectos-mineros-filter-options';

interface Props {
  visibleBase?: boolean;
  mostrarFiltroVisibilidad?: boolean;
}

const keysToStringSet = (
  keys: 'all' | Set<Key>,
  allValues: Array<string>,
) => {
  if (keys === 'all') {
    return new Set(allValues);
  }

  return new Set(Array.from(keys).map(String));
};

export function ProyectosMinerosFilters({ visibleBase }: Props) {
  const { t } = useTranslation();
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
  const [tiposSeleccionados, setTiposSeleccionados] = useState<Set<string>>(
    new Set((tiposIds ?? []).map(String)),
  );
  const [etapasSeleccionadas, setEtapasSeleccionadas] = useState<Set<string>>(
    new Set((etapasIds ?? []).map(String)),
  );
  const [mineralesSeleccionados, setMineralesSeleccionados] = useState<Set<string>>(
    new Set(minerales ?? []),
  );
  const [ubicacionesSeleccionadas, setUbicacionesSeleccionadas] = useState<Set<string>>(
    new Set(ubicaciones ?? []),
  );
  const [propietariosSeleccionados, setPropietariosSeleccionados] = useState<Set<string>>(
    new Set(propietarios ?? []),
  );
  const [provinciasSeleccionadas, setProvinciasSeleccionadas] = useState<Set<string>>(
    new Set(provinciasGeologicas ?? []),
  );
  const [convenio, setConvenio] = useState(
    convenioEmse === undefined ? 'todos' : convenioEmse ? 'si' : 'no',
  );

  const cantidadFiltrosAvanzados =
    (ubicaciones?.length ? 1 : 0) +
    (propietarios?.length ? 1 : 0) +
    (provinciasGeologicas?.length ? 1 : 0) +
    (convenioEmse !== undefined ? 1 : 0);

  const [mostrarAvanzados, setMostrarAvanzados] = useState(
    cantidadFiltrosAvanzados > 0,
  );

  useEffect(() => {
    setNombre(nombreLike ?? '');
  }, [nombreLike]);

  useEffect(() => {
    setTiposSeleccionados(new Set((tiposIds ?? []).map(String)));
  }, [tiposIds]);

  useEffect(() => {
    setEtapasSeleccionadas(new Set((etapasIds ?? []).map(String)));
  }, [etapasIds]);

  useEffect(() => {
    setMineralesSeleccionados(new Set(minerales ?? []));
  }, [minerales]);

  useEffect(() => {
    setUbicacionesSeleccionadas(new Set(ubicaciones ?? []));
  }, [ubicaciones]);

  useEffect(() => {
    setPropietariosSeleccionados(new Set(propietarios ?? []));
  }, [propietarios]);

  useEffect(() => {
    setProvinciasSeleccionadas(new Set(provinciasGeologicas ?? []));
  }, [provinciasGeologicas]);

  useEffect(() => {
    setConvenio(
      convenioEmse === undefined ? 'todos' : convenioEmse ? 'si' : 'no',
    );
  }, [convenioEmse]);

  useEffect(() => {
    if (cantidadFiltrosAvanzados > 0) {
      setMostrarAvanzados(true);
    }
  }, [cantidadFiltrosAvanzados]);

  // Elimina de la URL filtros antiguos que ya no forman parte de la interfaz.
  useEffect(() => {
    if (
      estadoVisible === undefined &&
      msnmDesde === undefined &&
      msnmHasta === undefined
    ) {
      return;
    }

    navigate({
      replace: true,
      search: (prev) => ({
        ...prev,
        estadoVisible: undefined,
        msnmDesde: undefined,
        msnmHasta: undefined,
        page: 1,
      }),
    });
  }, [estadoVisible, msnmDesde, msnmHasta, navigate]);

  const aplicarFiltros = (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    const nuevosTiposIds = Array.from(tiposSeleccionados)
      .map(Number)
      .filter(Number.isFinite);

    const nuevasEtapasIds = Array.from(etapasSeleccionadas)
      .map(Number)
      .filter(Number.isFinite);

    navigate({
      search: (prev) => ({
        ...prev,
        nombreLike: nombre.trim() || undefined,
        tiposIds: nuevosTiposIds.length > 0 ? nuevosTiposIds : undefined,
        etapasIds: nuevasEtapasIds.length > 0 ? nuevasEtapasIds : undefined,
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
          convenio === 'todos' ? undefined : convenio === 'si',
        estadoVisible: undefined,
        msnmDesde: undefined,
        msnmHasta: undefined,
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
    <form onSubmit={aplicarFiltros} className="flex flex-col gap-3">
      <div
        className="
          grid grid-cols-1 gap-3
          md:grid-cols-2
          xl:grid-cols-[minmax(240px,1.4fr)_minmax(180px,1fr)_minmax(210px,1.1fr)_minmax(190px,1fr)_auto]
          xl:items-end
        "
      >
        <Input
          label={t('routes.proyectosMineros.filtros.nombreLabel')}
          placeholder={t('routes.proyectosMineros.filtros.nombrePlaceholder')}
          value={nombre}
          onValueChange={setNombre}
          variant="bordered"
          size="sm"
          isClearable
          onClear={() => setNombre('')}
        />

        <Select
          label={t('routes.proyectosMineros.filtros.tipoLabel')}
          placeholder={t('routes.proyectosMineros.filtros.tipoPlaceholder')}
          selectionMode="multiple"
          selectedKeys={tiposSeleccionados}
          variant="bordered"
          size="sm"
          onSelectionChange={(keys) =>
            setTiposSeleccionados(
              keysToStringSet(
                keys as 'all' | Set<Key>,
                tipos.map((tipo) => String(tipo.id)),
              ),
            )
          }
        >
          {tipos.map((tipo) => (
            <SelectItem key={String(tipo.id)}>{tipo.nombre}</SelectItem>
          ))}
        </Select>

        <Select
          label={t('routes.proyectosMineros.filtros.etapaLabel')}
          placeholder={t('routes.proyectosMineros.filtros.etapaPlaceholder')}
          selectionMode="multiple"
          selectedKeys={etapasSeleccionadas}
          variant="bordered"
          size="sm"
          onSelectionChange={(keys) =>
            setEtapasSeleccionadas(
              keysToStringSet(
                keys as 'all' | Set<Key>,
                etapas.map((etapa) => String(etapa.id)),
              ),
            )
          }
        >
          {etapas.map((etapa) => (
            <SelectItem key={String(etapa.id)}>{etapa.nombre}</SelectItem>
          ))}
        </Select>

        <Select
          label={t('routes.proyectosMineros.filtros.mineralLabel')}
          placeholder={t('routes.proyectosMineros.filtros.mineralPlaceholder')}
          selectionMode="multiple"
          selectedKeys={mineralesSeleccionados}
          variant="bordered"
          size="sm"
          onSelectionChange={(keys) =>
            setMineralesSeleccionados(
              keysToStringSet(
                keys as 'all' | Set<Key>,
                opciones.minerales,
              ),
            )
          }
        >
          {opciones.minerales.map((mineral) => (
            <SelectItem key={mineral}>{mineral}</SelectItem>
          ))}
        </Select>

        <Button
          type="submit"
          color="primary"
          startContent={<Search size={17} />}
          className="w-full xl:w-auto"
        >
          {t('routes.proyectosMineros.filtros.aplicar')}
        </Button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <Button
          type="button"
          variant="light"
          startContent={<SlidersHorizontal size={17} />}
          endContent={
            mostrarAvanzados
              ? <ChevronUp size={16} />
              : <ChevronDown size={16} />
          }
          onPress={() => setMostrarAvanzados((actual) => !actual)}
        >
          {cantidadFiltrosAvanzados > 0
            ? t('routes.proyectosMineros.filtros.masFiltrosCantidad', { n: cantidadFiltrosAvanzados })
            : t('routes.proyectosMineros.filtros.masFiltros')}
        </Button>

        <Button
          type="button"
          variant="flat"
          startContent={<RotateCcw size={17} />}
          onPress={limpiarFiltros}
        >
          {t('routes.proyectosMineros.filtros.limpiar')}
        </Button>
      </div>

      {mostrarAvanzados && (
        <div className="rounded-xl border border-default-200 bg-default-50/50 p-3">
          <div className="mb-3">
            <h3 className="text-sm font-semibold">{t('routes.proyectosMineros.filtros.avanzadosTitulo')}</h3>
            <p className="text-xs text-default-500">
              {t('routes.proyectosMineros.filtros.avanzadosDescripcion')}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            <Select
              label={t('routes.proyectosMineros.filtros.ubicacionLabel')}
              placeholder={t('routes.proyectosMineros.filtros.ubicacionPlaceholder')}
              selectionMode="multiple"
              selectedKeys={ubicacionesSeleccionadas}
              variant="bordered"
              size="sm"
              onSelectionChange={(keys) =>
                setUbicacionesSeleccionadas(
                  keysToStringSet(
                    keys as 'all' | Set<Key>,
                    opciones.ubicaciones,
                  ),
                )
              }
            >
              {opciones.ubicaciones.map((ubicacion) => (
                <SelectItem key={ubicacion}>{ubicacion}</SelectItem>
              ))}
            </Select>

            <Select
              label={t('routes.proyectosMineros.filtros.propietarioLabel')}
              placeholder={t('routes.proyectosMineros.filtros.propietarioPlaceholder')}
              selectionMode="multiple"
              selectedKeys={propietariosSeleccionados}
              variant="bordered"
              size="sm"
              onSelectionChange={(keys) =>
                setPropietariosSeleccionados(
                  keysToStringSet(
                    keys as 'all' | Set<Key>,
                    opciones.propietarios,
                  ),
                )
              }
            >
              {opciones.propietarios.map((propietario) => (
                <SelectItem key={propietario}>{propietario}</SelectItem>
              ))}
            </Select>

            <Select
              label={t('routes.proyectosMineros.filtros.provinciaLabel')}
              placeholder={t('routes.proyectosMineros.filtros.provinciaPlaceholder')}
              selectionMode="multiple"
              selectedKeys={provinciasSeleccionadas}
              variant="bordered"
              size="sm"
              onSelectionChange={(keys) =>
                setProvinciasSeleccionadas(
                  keysToStringSet(
                    keys as 'all' | Set<Key>,
                    opciones.provinciasGeologicas,
                  ),
                )
              }
            >
              {opciones.provinciasGeologicas.map((provincia) => (
                <SelectItem key={provincia}>{provincia}</SelectItem>
              ))}
            </Select>

            <Select
              label={t('routes.proyectosMineros.filtros.convenioLabel')}
              selectedKeys={new Set([convenio])}
              variant="bordered"
              size="sm"
              onSelectionChange={(keys) => {
                if (keys === 'all') {
                  return;
                }

                setConvenio(String(Array.from(keys)[0] ?? 'todos'));
              }}
            >
              <SelectItem key="todos">{t('routes.proyectosMineros.filtros.convenioTodos')}</SelectItem>
              <SelectItem key="si">{t('routes.proyectosMineros.filtros.convenioSi')}</SelectItem>
              <SelectItem key="no">{t('routes.proyectosMineros.filtros.convenioNo')}</SelectItem>
            </Select>
          </div>
        </div>
      )}
    </form>
  );
}
