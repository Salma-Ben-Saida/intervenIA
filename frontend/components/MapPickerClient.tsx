"use client"

import React, { useEffect, useRef, useState } from "react"
import { MapContainer, TileLayer, Marker, useMapEvents, ZoomControl, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

import type { MapPickerProps } from "./MapPicker"
import { Button } from "@/components/ui/button"

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

function ClickHandler({ onClick }: { onClick: (latlng: L.LatLng) => void }) {
  useMapEvents({ click: (e) => onClick(e.latlng) })
  return null
}

function MapRefSetter({ mapRef }: { mapRef: React.MutableRefObject<L.Map | null> }) {
  const map = useMap()
  useEffect(() => {
    mapRef.current = map
    return () => { mapRef.current = null }
  }, [map, mapRef])
  return null
}

function FlyToPosition({ position }: { position: [number, number] | null }) {
  const map = useMap()
  useEffect(() => {
    if (position) map.setView(position, 14)
  }, [position, map])
  return null
}

type SearchResult = { display_name: string; lat: string; lon: string }

export default function MapPickerClient({
                                          initialCenter = [33.8869, 9.5375],
                                          initialZoom = 6,
                                          value = null,
                                          onChange,
                                          enableReverseGeocoding = true,
                                          className,
                                          showConfirmButton,
                                          onConfirm,
                                        }: MapPickerProps) {
  const [mounted, setMounted] = useState(false)
  const [markerPos, setMarkerPos] = useState<[number, number] | null>(
      value ? [value.lat, value.lng] : null
  )
  const [address, setAddress] = useState<string | undefined>()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [ignoreNextSearch, setIgnoreNextSearch] = useState(false)

  // ✅ KEY FIX: ref to the wrapper div — we scrub _leaflet_id before remount
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // ✅ Scrub the Leaflet fingerprint from the DOM node so Strict Mode remount works
  useEffect(() => {
    const node = containerRef.current
    if (!node) return
    return () => {
      // Find the actual map div inside our wrapper and clear its _leaflet_id
      const mapDiv = node.querySelector(".leaflet-container") as HTMLElement | null
      if (mapDiv) {
        delete (mapDiv as any)._leaflet_id
      }
    }
  }, [mounted])

  useEffect(() => {
    if (value) setMarkerPos([value.lat, value.lng])
  }, [value])

  useEffect(() => {
    if (ignoreNextSearch) { setIgnoreNextSearch(false); return }
    if (!query || query.length < 3) { setResults([]); return }
    const delay = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
        )
        if (res.ok) setResults(await res.json())
      } catch { setResults([]) }
      finally { setLoading(false) }
    }, 500)
    return () => clearTimeout(delay)
  }, [query, ignoreNextSearch])

  const handleSelectPlace = (place: SearchResult) => {
    const lat = Number(place.lat), lng = Number(place.lon)
    setIgnoreNextSearch(true)
    setMarkerPos([lat, lng])
    setAddress(place.display_name)
    setResults([])
    setQuery(place.display_name)
    mapRef.current?.setView([lat, lng], 14)
    onChange(lat, lng, place.display_name)
  }

  const handleMapClick = async (latlng: L.LatLng) => {
    const lat = Number(latlng.lat.toFixed(6))
    const lng = Number(latlng.lng.toFixed(6))
    setMarkerPos([lat, lng])
    let resolvedAddress: string | undefined
    if (enableReverseGeocoding) {
      try {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        )
        if (res.ok) resolvedAddress = (await res.json())?.display_name
      } catch { /* ignore */ }
    }
    setAddress(resolvedAddress)
    onChange(lat, lng, resolvedAddress)
  }

  if (!mounted) {
    return <div style={{ height: "320px", width: "100%" }} className="bg-muted animate-pulse rounded-xl" />
  }

  return (
      <div className={className}>
        {/* Search */}
        <div className="relative mb-2">
          <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search location..."
              className="w-full px-3 py-2 border rounded-md text-sm bg-background"
          />
          {loading && <div className="text-xs text-muted-foreground mt-1">Searching...</div>}
          {results.length > 0 && (
              <div className="absolute z-50 w-full bg-background border rounded-md mt-1 shadow-md max-h-60 overflow-auto">
                {results.map((r, i) => (
                    <div key={i} onClick={() => handleSelectPlace(r)}
                         className="p-2 text-sm hover:bg-muted cursor-pointer">
                      {r.display_name}
                    </div>
                ))}
              </div>
          )}
        </div>

        {/* ✅ Wrapper div with ref — Leaflet container lives here */}
        <div ref={containerRef}>
          <MapContainer
              center={initialCenter}
              zoom={initialZoom}
              scrollWheelZoom
              zoomControl={false}
              style={{ height: "320px", width: "100%", borderRadius: 12 }}
          >
            <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
            <ZoomControl position="bottomright" />
            <ClickHandler onClick={handleMapClick} />
            <MapRefSetter mapRef={mapRef} />
            <FlyToPosition position={markerPos} />
            {markerPos && <Marker position={markerPos} />}
          </MapContainer>
        </div>

        {/* Info */}
        <div className="mt-3 flex flex-col gap-2">
          {markerPos ? (
              <div className="text-sm text-muted-foreground">
                Selected: <span className="font-mono">{markerPos[0].toFixed(6)}, {markerPos[1].toFixed(6)}</span>
              </div>
          ) : (
              <div className="text-sm text-muted-foreground">Search or click on the map</div>
          )}
          {address && <div className="text-xs text-muted-foreground truncate" title={address}>{address}</div>}
          {showConfirmButton && markerPos && (
              <Button onClick={() => onConfirm?.(markerPos[0], markerPos[1], address)}>
                Confirm Location
              </Button>
          )}
        </div>
      </div>
  )
}