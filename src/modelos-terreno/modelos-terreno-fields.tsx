import { ArchivoField } from '@/common/archivo.field';
import { leerMetadataCog, type CogMetadata } from '@/common/extractMetaDataCog';
import { useRef, useState } from 'react';
import { Divider } from '@heroui/react';
import { useTranslation } from 'react-i18next';

// Lo que el componente reporta al padre
export interface ModeloTerrenoData {
  dtmCog: File | undefined;
  ortofotoCog: File | undefined;
  mdtColoreadoCog: File | undefined;
  dtmMeta: CogMetadata | null;
  ortofotoMeta: CogMetadata | null;
  coloreadoMeta: CogMetadata | null;
  mdtRaw: File | undefined;
  ortofotoPng: File | undefined;
  mdtRawMeta: CogMetadata | null;
  error: string | null;
}

interface ModeloTerrenoFieldsProps {
  onChange: (data: ModeloTerrenoData) => void;
  modeloActual?: {
    tieneMdt?: boolean;
    tieneOrtofoto?: boolean;
    tieneColoreado?: boolean;
    tieneMdtRaw?: boolean;
    tieneOrtofotoPng?: boolean;
  };
}

export const ModeloTerrenoFields = ({ onChange, modeloActual }: ModeloTerrenoFieldsProps) => {
  const { t } = useTranslation();
  const [dtmCog, setDtmCog] = useState<File | undefined>(undefined);
  const [ortofotoCog, setOrtofotoCog] = useState<File | undefined>(undefined);
  const [mdtColoreadoCog, setMdtColoreadoCog] = useState<File | undefined>(undefined);
  const [dtmMeta, setDtmMeta] = useState<CogMetadata | null>(null);
  const [ortofotoMeta, setOrtofotoMeta] = useState<CogMetadata | null>(null);
  const [coloreadoMeta, setColoreadoMeta] = useState<CogMetadata | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [mdtRaw, setMdtRawFile] = useState<File | undefined>(undefined);
  const [ortofotoPng, setOrtofotoPngFile] = useState<File | undefined>(undefined);
  const [mdtRawMeta, setMdtRawMeta] = useState<CogMetadata | null>(null)


  // Ref que mantiene el último snapshot reportado al padre
  const ultimoEstadoRef = useRef<ModeloTerrenoData>({
    dtmCog: undefined,
    ortofotoCog: undefined,
    mdtColoreadoCog: undefined,
    mdtRaw: undefined,
    ortofotoPng: undefined,
    dtmMeta: null,
    ortofotoMeta: null,
    coloreadoMeta: null,
    mdtRawMeta: null,
    error: null,
  });

  // Helper: notificar al padre con el estado actualizado
  const notificar = (overrides: Partial<ModeloTerrenoData>) => {
    // Mergeá el último estado con los overrides
    const nuevo = { ...ultimoEstadoRef.current, ...overrides };
    ultimoEstadoRef.current = nuevo;
    onChange(nuevo);
  };

  const handleDtmChange = async (file: File | undefined) => {
    setDtmCog(file);
    if (!file) {
      setDtmMeta(null);
      notificar({ dtmCog: undefined, dtmMeta: null });
      return;
    }
    try {
      const meta = await leerMetadataCog(file);
      setDtmMeta(meta);
      const error = meta.numBandas !== 1
        ? t('routes.admin.proyectosMineros.modeloTerreno.errores.mdtBandas')
        : null;
      setValidationError(error);
      notificar({ dtmCog: file, dtmMeta: meta, error });
    } catch {
      setDtmMeta(null);
      const error = t('routes.admin.proyectosMineros.modeloTerreno.errores.mdtLeer');
      setValidationError(error);
      notificar({ dtmCog: file, dtmMeta: null, error });
    }
  };

  const handleOrtofotoChange = async (file: File | undefined) => {
    setOrtofotoCog(file);
    if (!file) {
      setOrtofotoMeta(null);
      notificar({ ortofotoCog: undefined, ortofotoMeta: null });
      return;
    }
    try {
      const meta = await leerMetadataCog(file);
      setOrtofotoMeta(meta);
      setValidationError(null);
      notificar({ ortofotoCog: file, ortofotoMeta: meta, error: null });
    } catch {
      setOrtofotoMeta(null);
      const error = t('routes.admin.proyectosMineros.modeloTerreno.errores.ortofotoLeer');
      setValidationError(error);
      notificar({ ortofotoCog: file, ortofotoMeta: null, error });
    }
  };

  const handleColoreadoChange = async (file: File | undefined) => {
    setMdtColoreadoCog(file);
    if (!file) {
      setColoreadoMeta(null);
      notificar({ mdtColoreadoCog: undefined, coloreadoMeta: null });
      return;
    }
    try {
      const meta = await leerMetadataCog(file);
      setColoreadoMeta(meta);
      setValidationError(null);
      notificar({ mdtColoreadoCog: file, coloreadoMeta: meta, error: null });
    } catch {
      setColoreadoMeta(null);
      const error = t('routes.admin.proyectosMineros.modeloTerreno.errores.coloreadoLeer');
      setValidationError(error);
      notificar({ mdtColoreadoCog: file, coloreadoMeta: null, error });
    }
  };

  const handleMdtRawChange = async (file: File | undefined) => {
    setMdtRawFile(file);
    if (!file) {
      setMdtRawMeta(null);
      notificar({ mdtRaw: undefined, mdtRawMeta: null });
      return;
    }
    try {
      const meta = await leerMetadataCog(file);
      setMdtRawMeta(meta);
      if (meta.numBandas !== 1) {
        const error = t('routes.admin.proyectosMineros.modeloTerreno.errores.mdtRawBandas');
        setValidationError(error);
        notificar({ mdtRaw: file, mdtRawMeta: meta, error });
      } else {
        setValidationError(null);
        notificar({ mdtRaw: file, mdtRawMeta: meta, error: null });
      }
    } catch {
      setMdtRawMeta(null);
      const error = t('routes.admin.proyectosMineros.modeloTerreno.errores.mdtRawLeer');
      setValidationError(error);
      notificar({ mdtRaw: file, mdtRawMeta: null, error });
    }
  };

  const handleOrtofotoPngChange = (file: File | undefined) => {
    setOrtofotoPngFile(file);
    notificar({ ortofotoPng: file });
  };

  return (
    <div className=" pt-4 mt-4 space-y-4">
      <Divider className='my-4' />
      <h2 className="text-lg font-semibold">{t('routes.admin.proyectosMineros.modeloTerreno.titulo')}</h2>
      <p className="text-sm text-default-500">
        {t('routes.admin.proyectosMineros.modeloTerreno.descripcion')}
      </p>

      <div className="flex flex-row justify-center gap-4">
        <div className="space-y-1 flex-1">
          <ArchivoField
            label={t('routes.admin.proyectosMineros.modeloTerreno.mdt')}
            accept=".tif,.tiff,image/tiff"
            onChange={handleDtmChange}
          />
          {modeloActual?.tieneMdt && !dtmCog && (
            <p className="text-xs text-success">{t('routes.admin.proyectosMineros.modeloTerreno.yaHayMdt')}</p>
          )}
          {dtmMeta && (
            <p className="text-xs text-default-400">
              {t('routes.admin.proyectosMineros.modeloTerreno.metaElevacion', {
                min: dtmMeta.elevationMin,
                max: dtmMeta.elevationMax,
                ancho: dtmMeta.anchoPx,
                alto: dtmMeta.altoPx,
                bandas: dtmMeta.numBandas,
                crs: dtmMeta.crs,
              })}
            </p>
          )}
        </div>

        <div className="space-y-1 flex-1">
          <ArchivoField
            label={t('routes.admin.proyectosMineros.modeloTerreno.ortofoto')}
            accept=".tif,.tiff,image/tiff"
            onChange={handleOrtofotoChange}
          />
          {modeloActual?.tieneOrtofoto && !ortofotoCog && (
            <p className="text-xs text-success">{t('routes.admin.proyectosMineros.modeloTerreno.yaHayOrtofoto')}</p>
          )}
          {ortofotoMeta && (
            <p className="text-xs text-default-400">
              {t('routes.admin.proyectosMineros.modeloTerreno.metaBandas', {
                bandas: ortofotoMeta.numBandas,
                ancho: ortofotoMeta.anchoPx,
                alto: ortofotoMeta.altoPx,
                crs: ortofotoMeta.crs,
              })}
            </p>
          )}
        </div>

        <div className="space-y-1 flex-1">
          <ArchivoField
            label={t('routes.admin.proyectosMineros.modeloTerreno.coloreado')}
            accept=".tif,.tiff,image/tiff"
            onChange={handleColoreadoChange}
          />
          {modeloActual?.tieneColoreado && !mdtColoreadoCog && (
            <p className="text-xs text-success">{t('routes.admin.proyectosMineros.modeloTerreno.yaHayColoreado')}</p>
          )}
          {coloreadoMeta && (
            <p className="text-xs text-default-400">
              {t('routes.admin.proyectosMineros.modeloTerreno.metaBandas', {
                bandas: coloreadoMeta.numBandas,
                ancho: coloreadoMeta.anchoPx,
                alto: coloreadoMeta.altoPx,
                crs: coloreadoMeta.crs,
              })}
            </p>
          )}
        </div>

      </div>
      <Divider className='my-4' />
      <div className='flex flex-row items-center justify-center'>
        <div className="space-y-1">
          <ArchivoField
            label={t('routes.admin.proyectosMineros.modeloTerreno.mdtRaw')}
            accept=".tif,.tiff,image/tiff"
            onChange={handleMdtRawChange}
          />
          {modeloActual?.tieneMdtRaw && !mdtRaw && (
            <p className="text-xs text-success">{t('routes.admin.proyectosMineros.modeloTerreno.yaHayMdtRaw')}</p>
          )}
          {mdtRawMeta && (
            <p className="text-xs text-default-400">
              {t('routes.admin.proyectosMineros.modeloTerreno.metaElevacion', {
                min: mdtRawMeta.elevationMin,
                max: mdtRawMeta.elevationMax,
                ancho: mdtRawMeta.anchoPx,
                alto: mdtRawMeta.altoPx,
                bandas: mdtRawMeta.numBandas,
                crs: mdtRawMeta.crs,
              })}
            </p>
          )}
        </div>
        <div className="space-y-1">
          <ArchivoField
            label={t('routes.admin.proyectosMineros.modeloTerreno.ortofotoPng')}
            accept="image/png,image/jpeg"
            onChange={handleOrtofotoPngChange}
          />
          {modeloActual?.tieneOrtofotoPng && !ortofotoPng && (
            <p className="text-xs text-success">{t('routes.admin.proyectosMineros.modeloTerreno.yaHayOrtofotoPng')}</p>
          )}

        </div>
      </div>


      {validationError && (
        <p className="text-sm text-danger">{validationError}</p>
      )}
    </div>
  );
};
