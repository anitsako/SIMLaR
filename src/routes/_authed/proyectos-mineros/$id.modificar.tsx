import { ClientOnly, createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { Alert, Button, Input, NumberInput, Switch, Textarea, addToast } from '@heroui/react';
import 'leaflet/dist/leaflet.css';
import { useServerFn } from '@tanstack/react-start';
import type { SubmitEvent } from 'react';
import type { ModeloTerrenoData } from '@/modelos-terreno/modelos-terreno-fields.tsx';
import { updateProyectoMineroFn } from '@/proyectos-mineros/update-proyecto-minero.fn';
import { ProyectoMineroTipoField } from '@/proyectos-mineros-tipos/proyecto-minero-tipo.field';
import { CoordsField } from '@/mapa-principal/coords.field';
import { ArchivoField } from '@/common/archivo.field';
import { proyectoMineroQuery } from '@/proyectos-mineros/use-proyecto-minero';
import { ProyectoMineroEtapaField } from '@/proyectos-mineros-etapas/proyecto-minero-etapa.field';
import { upsertModeloTerrenoFn } from '@/modelos-terreno/upsert-modelo-terreno.fn';
import { ModeloTerrenoFields } from '@/modelos-terreno/modelos-terreno-fields.tsx';
import { useModeloTerrenoFn } from '@/modelos-terreno/use-modelo-terreno';

export const Route = createFileRoute('/_authed/proyectos-mineros/$id/modificar')({
  loader: ({ context: { queryClient }, params: { id } }) => {
    queryClient.ensureQueryData(proyectoMineroQuery(Number(id)));
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  const navigate = Route.useNavigate();
  const { data: proyecto } = useSuspenseQuery(proyectoMineroQuery(Number(id)));
  const { queryClient } = Route.useRouteContext();

  const coords = proyecto.coordenadasGeograficas;

  const [data, setData] = useState({
    nombre: proyecto.nombre,
    tipoId: proyecto.tipo.id,
    ubicacion: proyecto.ubicacion,
    provinciaGeologica: proyecto.provinciaGeologica,
    areaHectareas: proyecto.areaHectareas ?? undefined,
    litologia: proyecto.litologia,
    mineralizacion: proyecto.mineralizacion,
    mineralInteres: proyecto.mineralInteres,
    modeloGenetico: proyecto.modeloGenetico,
    accesos: proyecto.accesos,
    etapaId: proyecto.etapa.id,
    propietario: proyecto.propietario,
    localidadesCercanas: proyecto.localidadesCercanas,
    coordenadasGeograficas: { lat: coords[1], lng: coords[0] },
    msnm: proyecto.msnm,
    convenioEmse: proyecto.convenioEmse,
    visible: proyecto.visible,
    archivoMapa: undefined as File | undefined,
  });

  const [modeloData, setModeloData] = useState<ModeloTerrenoData | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const updateProyectoMinero = useServerFn(updateProyectoMineroFn);
  const upsertModeloTerreno = useServerFn(upsertModeloTerrenoFn);

  const { data: modeloActual } = useModeloTerrenoFn(Number(id));

  const {
    mutateAsync: modificarProyectoMinero,
    isPending,
    error,
  } = useMutation({
    mutationFn: async (payload: { proyecto: any; modelo: any | null }) => {
      const proyectoActualizado = await updateProyectoMinero({ data: payload.proyecto });

      if (payload.modelo) {
        await upsertModeloTerreno({
          data: { ...payload.modelo, proyectoMineroId: proyecto.id },
        });
      }
      return proyectoActualizado;
    },
    onSuccess: () => {
      addToast({
        title: 'Proyecto actualizado',
        description: 'El proyecto minero fue modificado correctamente.',
        color: 'success',
        variant: 'solid',
      });
      queryClient.invalidateQueries({ queryKey: ['proyectos-mineros'] });
      queryClient.invalidateQueries({ queryKey: ['modelo-terreno', proyecto.id] });
      navigate({ to: '/proyectos-mineros' });
    },
  });

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();

    if (
      data.areaHectareas === undefined ||
      !Number.isFinite(data.areaHectareas) ||
      data.areaHectareas <= 0
    ) {
      setValidationError('Debe ingresar una superficie válida en hectáreas.');
      return;
    }

    if (!data.msnm) {
      setValidationError('Debe ingresar la altitud (msnm).');
      return;
    }
    if (modeloData?.error) {
      setValidationError(modeloData.error);
      return;
    }

    setValidationError(null);

    const base64 = (file: File): Promise<string> =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

    // Archivo de mapa (opcional en modificar)
    let archivoMapa;
    if (data.archivoMapa) {
      archivoMapa = {
        nombre: data.archivoMapa.name,
        tamaño: data.archivoMapa.size,
        mimeType: data.archivoMapa.type,
        base64: await base64(data.archivoMapa),
      };
    }

    // Payload del proyecto
    const proyectoPayload = {
      id: proyecto.id,
      ...data,
      tipoId: data.tipoId,
      etapaId: data.etapaId,
      msnm: data.msnm,
      archivoMapa,
    };

    // Payload del modelo (si hay COGs nuevos)

    const hayCog = modeloData && (modeloData.dtmCog || modeloData.ortofotoCog || modeloData.mdtColoreadoCog);

    const hayArchivos3D = modeloData && (modeloData.mdtRaw || modeloData.ortofotoPng);
    const hayAlgunArchivo = hayCog || hayArchivos3D;
    let modeloPayload = null;

    if (hayAlgunArchivo) {
      const meta = modeloData.dtmMeta ?? modeloData.ortofotoMeta ?? modeloData.coloreadoMeta;
      modeloPayload = {
        nombre: 'Levantamiento inicial',
        mdtCog: modeloData.dtmCog
          ? {
              nombre: modeloData.dtmCog.name,
              tamaño: modeloData.dtmCog.size,
              mimeType: modeloData.dtmCog.type || 'image/tiff',
              base64: await base64(modeloData.dtmCog),
            }
          : null,
        ortofotoCog: modeloData.ortofotoCog
          ? {
              nombre: modeloData.ortofotoCog.name,
              tamaño: modeloData.ortofotoCog.size,
              mimeType: modeloData.ortofotoCog.type || 'image/tiff',
              base64: await base64(modeloData.ortofotoCog),
            }
          : null,
        mdtColoreadoCog: modeloData.mdtColoreadoCog
          ? {
              nombre: modeloData.mdtColoreadoCog.name,
              tamaño: modeloData.mdtColoreadoCog.size,
              mimeType: modeloData.mdtColoreadoCog.type || 'image/tiff',
              base64: await base64(modeloData.mdtColoreadoCog),
            }
          : null,
        mdtRaw: modeloData.mdtRaw
          ? {
              nombre: modeloData.mdtRaw.name,
              tamaño: modeloData.mdtRaw.size,
              mimeType: modeloData.mdtRaw.type || 'image/tiff',
              base64: await base64(modeloData.mdtRaw),
            }
          : null,
        ortofotoPng: modeloData.ortofotoPng
          ? {
              nombre: modeloData.ortofotoPng.name,
              tamaño: modeloData.ortofotoPng.size,
              mimeType: modeloData.ortofotoPng.type || 'image/png',
              base64: await base64(modeloData.ortofotoPng),
            }
          : null,
        crs: meta?.crs ?? modeloActual?.crs ?? 'EPSG:3857',
        boundsWest: meta?.boundsWest ?? modeloActual?.bounds.west ?? 0,
        boundsSouth: meta?.boundsSouth ?? modeloActual?.bounds.south ?? 0,
        boundsEast: meta?.boundsEast ?? modeloActual?.bounds.east ?? 0,
        boundsNorth: meta?.boundsNorth ?? modeloActual?.bounds.north ?? 0,
        centerLat: meta?.centerLat ?? modeloActual?.center.lat ?? 0,
        centerLon: meta?.centerLon ?? modeloActual?.center.lon ?? 0,
        defaultZoom: 15,
        elevationMin: modeloData.dtmMeta?.elevationMin ?? modeloActual?.elevation.min ?? null,
        elevationMax: modeloData.dtmMeta?.elevationMax ?? modeloActual?.elevation.max ?? null,
        resolucionMetros: meta?.resolucionMetros ?? null,
        anchoPx: meta?.anchoPx ?? null,
        altoPx: meta?.altoPx ?? null,
      };
    }
    await modificarProyectoMinero({ proyecto: proyectoPayload, modelo: modeloPayload });
  };
  return (
    <div className="mt-4 space-y-6">
      <h1 className="text-2xl font-bold">Modificar proyecto minero</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nombre"
          value={data.nombre}
          onValueChange={(v) => setData((prev) => ({ ...prev, nombre: v }))}
          maxLength={100}
          isRequired
        />

        <ProyectoMineroTipoField
          required
          id={data.tipoId}
          onChange={(v) => setData((prev) => ({ ...prev, tipoId: v! }))}
        />

        <Textarea
          label="Ubicación"
          value={data.ubicacion}
          onValueChange={(v) => setData((prev) => ({ ...prev, ubicacion: v }))}
          maxLength={100}
          isRequired
          minRows={2}
        />

        <Textarea
          label="Provincia geológica"
          value={data.provinciaGeologica}
          onValueChange={(v) => setData((prev) => ({ ...prev, provinciaGeologica: v }))}
          maxLength={100}
          isRequired
          minRows={2}
        />

        <NumberInput
          label="Superficie (hectáreas)"
          description="Ingresá únicamente el número, sin escribir ha ni Hs."
          value={data.areaHectareas}
          onValueChange={(v) =>
            setData((prev) => ({
              ...prev,
              areaHectareas: Number.isNaN(v) ? undefined : v,
            }))
          }
          minValue={0.01}
          step={0.01}
          isRequired
        />

        <Textarea
          label="Litología"
          value={data.litologia}
          onValueChange={(v) => setData((prev) => ({ ...prev, litologia: v }))}
          isRequired
          minRows={3}
        />

        <Textarea
          label="Mineralización"
          value={data.mineralizacion}
          onValueChange={(v) => setData((prev) => ({ ...prev, mineralizacion: v }))}
          isRequired
          minRows={3}
        />

        <Input
          label="Mineral de interés"
          value={data.mineralInteres}
          onValueChange={(v) => setData((prev) => ({ ...prev, mineralInteres: v }))}
          maxLength={100}
          isRequired
        />

        <Textarea
          label="Modelo genético"
          value={data.modeloGenetico}
          onValueChange={(v) => setData((prev) => ({ ...prev, modeloGenetico: v }))}
          minRows={3}
        />

        <Textarea
          label="Accesos"
          value={data.accesos}
          onValueChange={(v) => setData((prev) => ({ ...prev, accesos: v }))}
          isRequired
          minRows={3}
        />

        <ProyectoMineroEtapaField
          required
          id={data.etapaId}
          onChange={(v) => setData((prev) => ({ ...prev, etapaId: v! }))}
        />

        <Input
          label="Propietario"
          value={data.propietario}
          onValueChange={(v) => setData((prev) => ({ ...prev, propietario: v }))}
          maxLength={100}
          isRequired
        />

        <Textarea
          label="Localidades cercanas"
          value={data.localidadesCercanas}
          onValueChange={(v) => setData((prev) => ({ ...prev, localidadesCercanas: v }))}
          maxLength={100}
          isRequired
          minRows={2}
        />

        <ClientOnly>
          <CoordsField
            value={data.coordenadasGeograficas}
            onValueChange={(v) => setData((prev) => ({ ...prev, coordenadasGeograficas: v }))}
          />
        </ClientOnly>

        <NumberInput
          label="Altitud (msnm)"
          value={data.msnm}
          onValueChange={(v) => setData((prev) => ({ ...prev, msnm: v }))}
          isRequired
        />

        <div className="flex items-center gap-4">
          <Switch
            isSelected={data.convenioEmse}
            onValueChange={(v) => setData((prev) => ({ ...prev, convenioEmse: v }))}
          >
            Convenio EMSE
          </Switch>
          <Switch isSelected={data.visible} onValueChange={(v) => setData((prev) => ({ ...prev, visible: v }))}>
            Visible
          </Switch>
        </div>

        <div className="space-y-1">
          <p className="text-sm text-default-500">
            Archivo actual: <span className="font-medium">{proyecto.archivoMapa.nombre}</span>. Seleccioná un nuevo
            archivo solo si querés reemplazarlo.
          </p>
          <ArchivoField
            label="Archivo de mapa"
            accept="image/png, image/jpeg, image/webp"
            onChange={(archivoMapa) => setData((prev) => ({ ...prev, archivoMapa }))}
          />
        </div>

        <ModeloTerrenoFields
          onChange={setModeloData}
          modeloActual={{
            tieneMdt: !!modeloActual?.mdt,
            tieneOrtofoto: !!modeloActual?.ortofoto,
            tieneColoreado: !!modeloActual?.mdtColoreado,
            tieneMdtRaw: !!modeloActual?.mdtRaw,
            tieneOrtofotoPng: !!modeloActual?.ortofotoPng,
          }}
        />

        {(validationError || error) && (
          <Alert color="danger">
            {validationError ?? (error as any)?.message ?? 'Error al modificar el proyecto minero.'}
          </Alert>
        )}

        <Button type="submit" color="primary" isLoading={isPending} className="w-full">
          Guardar cambios
        </Button>
      </form>
    </div>
  );
}
