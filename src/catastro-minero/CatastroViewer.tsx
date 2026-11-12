import { useEffect, useRef, useState, type Ref } from 'react'
import { t } from './labels'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { CATASTRO_BASE_MAP } from './baseMap'
import { fetchCatastroGeoJson } from './geojson'
import { bboxOfRings, PolygonGridIndex, ringsFromGeometry, type IndexedGeometry } from './geometry'
import { formatCandidateLabel, rankByPointName } from './identify'
import {
  CATASTRO_LAYER_COLORS,
  CATASTRO_LAYER_TYPES,
  classifyCatastroLayer,
  polygonStyleFor,
  POLYGON_HOVER_STYLE,
  type CatastroLayerType,
} from './layerType'
import { parcelCardHasContent, parseParcelCard } from './parcelCard'
import { identityFromProperties, type ParcelIdentity } from './parcelIdentity'
import styles from './CatastroViewer.module.css'

const POINT_STYLE: L.CircleMarkerOptions = {
  radius: 4,
  bubblingMouseEvents: false,
  color: '#f76108',
  weight: 1,
  opacity: 0.9,
  fillColor: '#f76108',
  fillOpacity: 0.85,
}

const POPUP_OPTIONS: L.PopupOptions = {
  maxWidth: 320,
  minWidth: 200,
  autoPanPadding: [24, 24],
}

function isPolygonFeature(feature: GeoJSON.Feature): boolean {
  const type = feature.geometry?.type
  return type === 'Polygon' || type === 'MultiPolygon'
}

function isPointFeature(feature: GeoJSON.Feature): boolean {
  const type = feature.geometry?.type
  return type === 'Point' || type === 'MultiPoint'
}

function isPolygonGeometry(
  geometry: GeoJSON.Geometry | null | undefined,
): geometry is GeoJSON.Polygon | GeoJSON.MultiPolygon {
  return geometry?.type === 'Polygon' || geometry?.type === 'MultiPolygon'
}

function featureName(properties: GeoJSON.GeoJsonProperties | null | undefined): string | null {
  if (!properties || typeof properties !== 'object') {
    return null
  }

  const name = properties.name
  return typeof name === 'string' && name !== '' ? name : null
}

type ViewerErrorKey =
  | 'gestionMinera.tramites.catastro.errorMapInit'
  | 'gestionMinera.tramites.catastro.errorGeojsonLoad'
  | 'gestionMinera.tramites.catastro.errorGeojsonInvalid'
  | 'gestionMinera.tramites.catastro.errorNoGeometries'

type ViewerStatus =
  | { type: 'loading' }
  | { type: 'ready' }
  | { type: 'error'; messageKey: ViewerErrorKey }

export interface CatastroViewerProps {
  readonly geojsonUrls: readonly string[]
  readonly title: string
}

interface IndexedParcel extends IndexedGeometry {
  id: number
  identity: ParcelIdentity
  layerType: CatastroLayerType | null
  layer: L.Path
  feature: GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>
}

interface ParcelPopupLabels {
  readonly empty: string
  readonly type: string
  readonly expediente: string
  readonly titular: string
  readonly departamento: string
  readonly superficie: string
  readonly typeNames: Record<CatastroLayerType, string>
}

interface ParcelPopupClassNames {
  readonly root: string
  readonly title: string
  readonly row: string
}

function appendPopupField(
  list: HTMLDListElement,
  label: string,
  value: string | undefined,
  rowClass: string,
): void {
  if (!value) {
    return
  }
  const row = document.createElement('div')
  row.className = rowClass
  const term = document.createElement('dt')
  const definition = document.createElement('dd')
  term.textContent = label
  definition.textContent = value
  row.append(term, definition)
  list.append(row)
}

function buildParcelPopup(
  properties: GeoJSON.GeoJsonProperties | null | undefined,
  labels: ParcelPopupLabels,
  classNames: ParcelPopupClassNames,
): HTMLElement {
  const root = document.createElement('div')
  root.className = classNames.root
  const info = parseParcelCard(properties)

  if (!parcelCardHasContent(info)) {
    const empty = document.createElement('p')
    empty.textContent = labels.empty
    root.append(empty)
    return root
  }

  if (info.name) {
    const title = document.createElement('h3')
    title.className = classNames.title
    title.textContent = info.name
    root.append(title)
  }

  const list = document.createElement('dl')
  appendPopupField(list, labels.type, info.type ? labels.typeNames[info.type] : undefined, classNames.row)
  appendPopupField(list, labels.expediente, info.expediente, classNames.row)
  appendPopupField(list, labels.titular, info.titular, classNames.row)
  appendPopupField(list, labels.departamento, info.departamento, classNames.row)
  appendPopupField(list, labels.superficie, info.superficie, classNames.row)

  if (list.childElementCount > 0) {
    root.append(list)
  }

  return root
}

function buildCandidatePicker(
  candidates: readonly IndexedParcel[],
  title: string,
  onSelect: (parcel: IndexedParcel) => void,
): HTMLElement {
  const root = document.createElement('div')
  root.className = styles.picker

  const heading = document.createElement('p')
  heading.className = styles.pickerTitle
  heading.textContent = title
  root.append(heading)

  const list = document.createElement('ul')
  list.className = styles.pickerList

  for (const candidate of candidates) {
    const item = document.createElement('li')
    const button = document.createElement('button')
    button.type = 'button'
    button.className = styles.pickerButton
    button.textContent = formatCandidateLabel(candidate.identity)
    button.addEventListener('click', (event) => {
      event.preventDefault()
      event.stopPropagation()
      onSelect(candidate)
    })
    item.append(button)
    list.append(item)
  }

  root.append(list)
  return root
}

function ViewerFrame({
  title,
  status,
  mapRef,
}: {
  readonly title: string
  readonly status: ViewerStatus
  readonly mapRef?: Ref<HTMLDivElement>
}) {

  return (
    <div className={styles.shell}>
      <div ref={mapRef} className={styles.map} role="region" aria-label={title} />
      {status.type === 'ready' ? (
        <aside className={styles.legend} aria-label={t('gestionMinera.tramites.catastro.legendTitle')}>
          <p className={styles.legendTitle}>{t('gestionMinera.tramites.catastro.legendTitle')}</p>
          <ul className={styles.legendList}>
            {CATASTRO_LAYER_TYPES.map((layerType) => (
              <li key={layerType} className={styles.legendItem}>
                <span
                  className={styles.legendSwatch}
                  style={{ color: CATASTRO_LAYER_COLORS[layerType] }}
                  aria-hidden="true"
                />
                <span>{t(`gestionMinera.tramites.catastro.layers.${layerType}`)}</span>
              </li>
            ))}
          </ul>
        </aside>
      ) : null}
      {status.type !== 'ready' ? (
        <div
          className={styles.status}
          role={status.type === 'error' ? 'alert' : 'status'}
          aria-live={status.type === 'error' ? 'assertive' : 'polite'}
          aria-busy={status.type === 'loading'}
        >
          {status.type === 'loading' ? t('common.loading') : t(status.messageKey)}
        </div>
      ) : null}
    </div>
  )
}

export function CatastroViewer({ geojsonUrls, title }: CatastroViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<ViewerStatus>({ type: 'loading' })
  const geojsonKey = geojsonUrls.join('|')
  const emptyPropertiesLabel = t('gestionMinera.tramites.catastro.emptyProperties')
  const fieldTypeLabel = t('gestionMinera.tramites.catastro.fields.type')
  const fieldExpedienteLabel = t('gestionMinera.tramites.catastro.fields.expediente')
  const fieldTitularLabel = t('gestionMinera.tramites.catastro.fields.titular')
  const fieldDepartamentoLabel = t('gestionMinera.tramites.catastro.fields.departamento')
  const fieldSuperficieLabel = t('gestionMinera.tramites.catastro.fields.superficie')
  const typeCateos = t('gestionMinera.tramites.catastro.type.cateos')
  const typeManifestaciones = t('gestionMinera.tramites.catastro.type.manifestaciones')
  const typeCanteras = t('gestionMinera.tramites.catastro.type.canteras')
  const typeMinas = t('gestionMinera.tramites.catastro.type.minas')
  const typePasmaMinas = t('gestionMinera.tramites.catastro.type.pasma-minas')
  const typeAluviones = t('gestionMinera.tramites.catastro.type.aluviones')
  const typeAreasEspeciales = t('gestionMinera.tramites.catastro.type.areas-especiales')
  const identifyTitle = t('gestionMinera.tramites.catastro.identifyTitle')
  const noParcelAssociated = t('gestionMinera.tramites.catastro.noParcelAssociated')

  useEffect(() => {
    const container = containerRef.current
    if (!container) {
      return
    }

    const popupLabels: ParcelPopupLabels = {
      empty: emptyPropertiesLabel,
      type: fieldTypeLabel,
      expediente: fieldExpedienteLabel,
      titular: fieldTitularLabel,
      departamento: fieldDepartamentoLabel,
      superficie: fieldSuperficieLabel,
      typeNames: {
        cateos: typeCateos,
        manifestaciones: typeManifestaciones,
        canteras: typeCanteras,
        minas: typeMinas,
        'pasma-minas': typePasmaMinas,
        aluviones: typeAluviones,
        'areas-especiales': typeAreasEspeciales,
      },
    }
    const popupClassNames: ParcelPopupClassNames = {
      root: styles.parcelPopup,
      title: styles.cardTitle,
      row: styles.cardRow,
    }

    let cancelled = false
    let map: L.Map | undefined
    let resizeObserver: ResizeObserver | undefined
    let selectedParcel: IndexedParcel | null = null
    let pointLayerGroup: L.FeatureGroup | undefined

    const popupOptions: L.PopupOptions = {
      ...POPUP_OPTIONS,
      className: styles.popup,
    }

    function keepLabelsOnTop() {
      pointLayerGroup?.bringToFront()
    }

    function applyCategoryStyle(parcel: IndexedParcel) {
      parcel.layer.setStyle(polygonStyleFor(parcel.layerType))
    }

    function clearSelection() {
      if (selectedParcel) {
        applyCategoryStyle(selectedParcel)
        selectedParcel = null
      }
      keepLabelsOnTop()
    }

    function selectParcel(parcel: IndexedParcel) {
      if (selectedParcel && selectedParcel.layer !== parcel.layer) {
        applyCategoryStyle(selectedParcel)
      }
      selectedParcel = parcel
      parcel.layer.setStyle(POLYGON_HOVER_STYLE)
      parcel.layer.bringToFront()
      keepLabelsOnTop()
    }

    function openParcelPopup(parcel: IndexedParcel, latlng: L.LatLng) {
      selectParcel(parcel)
      const content = buildParcelPopup(parcel.feature.properties, popupLabels, popupClassNames)
      parcel.layer
        .bindPopup(content, popupOptions)
        .off('click')
        .openPopup(latlng)
        .once('popupclose', () => {
          if (selectedParcel === parcel) {
            applyCategoryStyle(parcel)
            selectedParcel = null
          }
          keepLabelsOnTop()
        })
    }

    async function setup() {
      try {

        const urls = geojsonKey.length > 0 ? geojsonKey.split('|') : []
        const { collections, failed } = await fetchCatastroGeoJson(urls)

        if (cancelled || !containerRef.current) {
          return
        }

        if (collections.length === 0) {
          const allInvalid = failed.length > 0 && failed.every((item) => item.error.kind === 'invalid')
          setStatus({
            type: 'error',
            messageKey: allInvalid
              ? 'gestionMinera.tramites.catastro.errorGeojsonInvalid'
              : 'gestionMinera.tramites.catastro.errorGeojsonLoad',
          })
          return
        }

        if (failed.length > 0) {
          console.warn(
            `[catastro] ${failed.length} de ${urls.length} capas no pudieron cargarse. Se muestran las restantes.`,
            failed.map((item) => item.url),
          )
        }

        map = L.map(containerRef.current, {
          attributionControl: true,
          zoomControl: true,
        })

        L.tileLayer(CATASTRO_BASE_MAP.url, {
          attribution: CATASTRO_BASE_MAP.attribution,
          maxZoom: CATASTRO_BASE_MAP.maxZoom,
        }).addTo(map)

        const polygonLayerGroup = L.featureGroup()
        const labelLayerGroup = L.featureGroup()
        pointLayerGroup = labelLayerGroup
        const cadastralIndex = new PolygonGridIndex<IndexedParcel>()

        polygonLayerGroup.addTo(map)
        labelLayerGroup.addTo(map)

        const identifyAt = (latlng: L.LatLng, pointName: string | null, pointFeature?: GeoJSON.Feature) => {
          const hits = cadastralIndex.query(latlng.lng, latlng.lat)
          const ranked = pointName ? rankByPointName(hits, pointName) : hits

          if (ranked.length === 0) {
            clearSelection()
            if (!pointFeature || !map) {
              map?.closePopup()
              return
            }
            const root = document.createElement('div')
            root.className = styles.parcelPopup
            const note = document.createElement('p')
            note.textContent = noParcelAssociated
            root.append(
              note,
              buildParcelPopup(pointFeature.properties, popupLabels, {
                root: '',
                title: styles.cardTitle,
                row: styles.cardRow,
              }),
            )
            L.popup(popupOptions).setLatLng(latlng).setContent(root).openOn(map)
            return
          }

          if (ranked.length === 1) {
            const only = ranked[0]
            if (only) {
              openParcelPopup(only, latlng)
            }
            return
          }

          clearSelection()
          if (!map) {
            return
          }
          const picker = buildCandidatePicker(ranked, identifyTitle, (parcel) => {
            openParcelPopup(parcel, latlng)
          })
          L.popup(popupOptions).setLatLng(latlng).setContent(picker).openOn(map)
        }

        for (const collection of collections) {
          try {
            const polygonFeatures = collection.data.features.filter(isPolygonFeature)
            const pointFeatures = collection.data.features.filter(isPointFeature)
            const polygonCollection: GeoJSON.FeatureCollection = {
              type: 'FeatureCollection',
              features: polygonFeatures,
            }
            const pointCollection: GeoJSON.FeatureCollection = {
              type: 'FeatureCollection',
              features: pointFeatures,
            }

            const polygonLayer = L.geoJSON(polygonCollection, {
                style: (feature) => polygonStyleFor(classifyCatastroLayer(feature?.properties)),
                onEachFeature: (feature, featureLayer) => {
                  if (!isPolygonGeometry(feature.geometry) || !(featureLayer instanceof L.Path)) {
                    return
                  }
                  const rings = ringsFromGeometry(feature.geometry)
                  const parcel: IndexedParcel = {
                    id: -1,
                    rings,
                    bbox: bboxOfRings(rings),
                    identity: identityFromProperties(feature.properties),
                    layerType: classifyCatastroLayer(feature.properties),
                    layer: featureLayer,
                    feature: feature as GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>,
                  }
                  parcel.id = cadastralIndex.add(parcel)

                  featureLayer.on('mouseover', () => {
                    featureLayer.setStyle(POLYGON_HOVER_STYLE)
                    featureLayer.bringToFront()
                  })
                  featureLayer.on('mouseout', () => {
                    if (selectedParcel?.layer !== featureLayer) {
                      applyCategoryStyle(parcel)
                    }
                    keepLabelsOnTop()
                  })
                },
              },
            )

            const pointLayer = L.geoJSON(pointCollection, {
                pointToLayer: (_feature, latlng) => L.circleMarker(latlng, POINT_STYLE),
                onEachFeature: (feature, featureLayer) => {
                  const name = featureName(feature.properties)
                  if (name) {
                    const tooltip = document.createElement('span')
                    tooltip.textContent = name
                    featureLayer.bindTooltip(tooltip, {
                      direction: 'top',
                      sticky: true,
                      opacity: 0.95,
                    })
                  }
                  featureLayer.on('click', (event: L.LeafletMouseEvent) => {
                            L.DomEvent.stop(event.originalEvent)
                    identifyAt(event.latlng, name, feature)
                  })
                },
              },
            )

            polygonLayer.addTo(polygonLayerGroup)
            pointLayer.addTo(labelLayerGroup)
          } catch (error) {
            console.error(`[catastro] No se pudo renderizar la capa GeoJSON: ${collection.url}`, error)
          }
        }

        labelLayerGroup.bringToFront()

        const bounds = L.featureGroup([polygonLayerGroup, labelLayerGroup]).getBounds()
        if (!bounds.isValid()) {
          setStatus({
            type: 'error',
            messageKey: 'gestionMinera.tramites.catastro.errorNoGeometries',
          })
          return
        }

        map.on('click', (event: L.LeafletMouseEvent) => {
          identifyAt(event.latlng, null)
        })

        map.fitBounds(bounds, { padding: [48, 48], animate: false })
        map.invalidateSize()

        resizeObserver = new ResizeObserver(() => {
          map?.invalidateSize({ animate: false })
        })
        resizeObserver.observe(containerRef.current)

        if (!cancelled) {
          setStatus({ type: 'ready' })
        }
      } catch (error) {
        console.error('[catastro] No se pudo inicializar el visor.', error)
        if (!cancelled) {
          setStatus({
            type: 'error',
            messageKey: 'gestionMinera.tramites.catastro.errorMapInit',
          })
        }
      }
    }

    void setup()

    return () => {
      cancelled = true
      resizeObserver?.disconnect()
      if (map) {
        map.remove()
        map = undefined
      }
    }
  }, [
    emptyPropertiesLabel,
    fieldDepartamentoLabel,
    fieldExpedienteLabel,
    fieldSuperficieLabel,
    fieldTitularLabel,
    fieldTypeLabel,
    geojsonKey,
    identifyTitle,
    noParcelAssociated,
    typeAluviones,
    typeAreasEspeciales,
    typeCanteras,
    typeCateos,
    typeManifestaciones,
    typeMinas,
    typePasmaMinas,
  ])

  return <ViewerFrame title={title} status={status} mapRef={containerRef} />
}
