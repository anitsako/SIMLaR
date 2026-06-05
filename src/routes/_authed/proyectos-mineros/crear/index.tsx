import { ClientOnly, createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Alert, Button, Input, NumberInput, Switch, Textarea, addToast } from '@heroui/react';
import 'leaflet/dist/leaflet.css';
import { useServerFn } from '@tanstack/react-start';
import type { SubmitEvent } from 'react';
import { createProyectoMineroFn } from '@/proyectos-mineros/create-proyecto-minero.fn';
import { upsertModeloTerrenoFn } from '@/modelos-terreno/upsert-modelo-terreno.fn'
import { ProyectoMineroTipoField } from '@/proyectos-mineros-tipos/proyecto-minero-tipo.field';
import { CoordsField } from '@/mapa-principal/coords.field';
import { ArchivoField } from '@/common/archivo.field';
import { ProyectoMineroEtapaField } from '@/proyectos-mineros-etapas/proyecto-minero-etapa.field';
import { ModeloTerrenoFields, type ModeloTerrenoData } from '@/modelos-terreno/modelos-terreno-fields'

export const Route = createFileRoute('/_authed/proyectos-mineros/crear/')({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    nombre: '',
    tipoId: undefined as number | undefined,
    ubicacion: '',
    provinciaGeologica: '',
    area: '',
    litologia: '',
    mineralizacion: '',
    mineralInteres: '',
    modeloGenetico: '',
    accesos: '',
    etapaId: undefined as number | undefined,
    propietario: '',
    localidadesCercanas: '',
    coordenadasGeograficas: { lat: -29.8135, lng: -66.8558 },
    msnm: undefined as number | undefined,
    convenioEmse: false,
    visible: true,
    archivoMapa: undefined as File | undefined,
  });


  const [modeloData, setModeloData] = useState<ModeloTerrenoData | null>(null);


  const [validationError, setValidationError] = useState<string | null>(null);

  const crearProyectoMinero = useServerFn(createProyectoMineroFn);
  const upsertModeloTerreno = useServerFn(upsertModeloTerrenoFn)
  const {
    mutateAsync: createProyectoMinero,
    isPending,
    error,
  } = useMutation({
    mutationFn: async (payload: {
      proyecto: any;
      modelo: any | null;
    }) => {
      // 1. Crear el proyecto
      const proyecto = await crearProyectoMinero({ data: payload.proyecto });

      // 2. Si hay modelo, crearlo
      if (payload.modelo) {
        await upsertModeloTerreno({
          data: { ...payload.modelo, proyectoMineroId: proyecto.id },
        });
      }

      return proyecto;
    },
    onSuccess: () => {
      addToast({
        title: 'Proyecto creado',
        description: 'El proyecto minero fue creado correctamente.',
        color: 'success',
        variant: 'solid',
      });
      navigate({ to: '/proyectos-mineros' });
    },
  });


  const base64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();

    if (!data.msnm) {
      setValidationError('Debe ingresar la altitud (msnm).');
      return;
    }

    if (!data.archivoMapa) {
      setValidationError('Debe subir un archivo de mapa.');
      return;
    }

    if (modeloData?.error) {
      setValidationError(modeloData.error);
      return;
    }

    setValidationError(null);

    const archivoMapaBase64 = await base64(data.archivoMapa)


    // Armar payload del proyecto
    const proyectoPayload = {
      ...data,
      tipoId: data.tipoId!,
      etapaId: data.etapaId!,
      msnm: data.msnm,
      archivoMapa: {
        nombre: data.archivoMapa.name,
        tamaño: data.archivoMapa.size,
        mimeType: data.archivoMapa.type,
        base64: archivoMapaBase64,
      },
    };

    // Payload del modelo (si hay COGs nuevos)
    const hayCog = modeloData && (modeloData.dtmCog || modeloData.ortofotoCog || modeloData.mdtColoreadoCog);

    const hayArchivos3D = modeloData && (modeloData.mdtRaw || modeloData.ortofotoPng);
    const hayAlgunArchivo = hayCog || hayArchivos3D;
    let modeloPayload = null;

    if (hayAlgunArchivo && modeloData) {
      const meta = modeloData.dtmMeta ?? modeloData.ortofotoMeta ?? modeloData.coloreadoMeta ?? modeloData.mdtRawMeta;
      modeloPayload = {
        nombre: 'Levantamiento inicial',
        mdtCog: modeloData.dtmCog
          ? { nombre: modeloData.dtmCog.name, tamaño: modeloData.dtmCog.size, mimeType: modeloData.dtmCog.type || 'image/tiff', base64: await base64(modeloData.dtmCog) }
          : null,
        ortofotoCog: modeloData.ortofotoCog
          ? { nombre: modeloData.ortofotoCog.name, tamaño: modeloData.ortofotoCog.size, mimeType: modeloData.ortofotoCog.type || 'image/tiff', base64: await base64(modeloData.ortofotoCog) }
          : null,
        mdtColoreadoCog: modeloData.mdtColoreadoCog
          ? { nombre: modeloData.mdtColoreadoCog.name, tamaño: modeloData.mdtColoreadoCog.size, mimeType: modeloData.mdtColoreadoCog.type || 'image/tiff', base64: await base64(modeloData.mdtColoreadoCog) }
          : null,
        mdtRaw: modeloData.mdtRaw
          ? { nombre: modeloData.mdtRaw.name, tamaño: modeloData.mdtRaw.size, mimeType: modeloData.mdtRaw.type || 'image/tiff', base64: await base64(modeloData.mdtRaw) }
          : null,
        ortofotoPng: modeloData.ortofotoPng
          ? { nombre: modeloData.ortofotoPng.name, tamaño: modeloData.ortofotoPng.size, mimeType: modeloData.ortofotoPng.type || 'image/png', base64: await base64(modeloData.ortofotoPng) }
          : null,
        crs: meta?.crs ?? 'EPSG:3857',
        boundsWest: meta?.boundsWest ?? 0,
        boundsSouth: meta?.boundsSouth ?? 0,
        boundsEast: meta?.boundsEast ?? 0,
        boundsNorth: meta?.boundsNorth ?? 0,
        centerLat: meta?.centerLat ?? 0,
        centerLon: meta?.centerLon ?? 0,
        defaultZoom: 15,
        elevationMin: modeloData.dtmMeta?.elevationMin ?? modeloData.mdtRawMeta?.elevationMin ?? null,
        elevationMax: modeloData.dtmMeta?.elevationMax ?? modeloData.mdtRawMeta?.elevationMax ?? null,
        resolucionMetros: meta?.resolucionMetros ?? null,
        anchoPx: meta?.anchoPx ?? null,
        altoPx: meta?.altoPx ?? null,
      };
    }

    await createProyectoMinero({ proyecto: proyectoPayload, modelo: modeloPayload });
  }; return (
    <div className="my-4 space-y-6">
      <h1 className="text-2xl font-bold">Crear proyecto minero</h1>

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
          onChange={(v) => setData((prev) => ({ ...prev, tipoId: v }))}
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

        <Input
          label="Área"
          value={data.area}
          onValueChange={(v) => setData((prev) => ({ ...prev, area: v }))}
          maxLength={10}
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
          isRequired
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
          onChange={(v) => setData((prev) => ({ ...prev, etapaId: v }))}
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

        <ArchivoField
          required
          accept="image/png, image/jpeg, image/webp"
          label="Archivo de mapa"
          onChange={(archivoMapa) => setData((prev) => ({ ...prev, archivoMapa }))}
        />
        {/* NUEVO: sección de modelo de terreno */}
        <ModeloTerrenoFields onChange={setModeloData} />

        {(validationError || error) && (
          <Alert color="danger">
            {validationError ?? (error as any)?.message ?? 'Error al crear el proyecto minero.'}
          </Alert>
        )}

        <Button type="submit" color="primary" isLoading={isPending} className="w-full">
          Crear proyecto
        </Button>
      </form>
    </div>
  );
}
