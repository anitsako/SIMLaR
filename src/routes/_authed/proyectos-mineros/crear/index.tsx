import { ClientOnly, createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Alert, Button, Input, NumberInput, Switch, Textarea, addToast } from '@heroui/react';
import 'leaflet/dist/leaflet.css';
import { useServerFn } from '@tanstack/react-start';
import type { SubmitEvent } from 'react';
import { createProyectoMineroFn } from '@/proyectos-mineros/create-proyecto-minero.fn';
import { ProyectoMineroTipoField } from '@/proyectos-mineros-tipos/proyecto-minero-tipo.field';
import { CoordsField } from '@/mapa-principal/coords.field';
import { ArchivoField } from '@/common/archivo.field';

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
    etapa: '',
    propietario: '',
    localidadesCercanas: '',
    coordenadasGeograficas: { lat: -29.8135, lng: -66.8558 },
    msnm: undefined as number | undefined,
    convenioEmse: false,
    visible: true,
    archivoMapa: undefined as File | undefined,
  });
  const [validationError, setValidationError] = useState<string | null>(null);

  const createProyectoMinero = useServerFn(createProyectoMineroFn);
  const {
    mutate: crearProyectoMinero,
    isPending,
    error,
  } = useMutation({
    mutationFn: createProyectoMinero,
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

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();

    if (!data.tipoId) {
      setValidationError('Debe seleccionar un tipo de proyecto.');
      return;
    }

    if (!data.msnm) {
      setValidationError('Debe ingresar la altitud (msnm).');
      return;
    }

    if (!data.archivoMapa) {
      setValidationError('Debe subir un archivo de mapa.');
      return;
    }

    setValidationError(null);

    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(data.archivoMapa!);
    });

    crearProyectoMinero({
      data: {
        ...data,
        tipoId: data.tipoId,
        msnm: data.msnm,
        archivoMapa: {
          nombre: data.archivoMapa.name,
          tamaño: data.archivoMapa.size,
          mimeType: data.archivoMapa.type,
          base64,
        },
      },
    });
  };

  return (
    <div className="mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Crear proyecto minero</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nombre"
          value={data.nombre}
          onValueChange={(v) => setData((prev) => ({ ...prev, nombre: v }))}
          maxLength={100}
          isRequired
        />

        <ProyectoMineroTipoField id={data.tipoId} onChange={(v) => setData((prev) => ({ ...prev, tipoId: v }))} />

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

        <Input
          label="Etapa"
          value={data.etapa}
          onValueChange={(v) => setData((prev) => ({ ...prev, etapa: v }))}
          maxLength={100}
          isRequired
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
          label="Archivo de mapa"
          onChange={(archivoMapa) => setData((prev) => ({ ...prev, archivoMapa }))}
        />

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
