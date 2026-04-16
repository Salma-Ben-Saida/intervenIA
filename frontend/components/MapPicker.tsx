import dynamic from "next/dynamic"

export interface MapPickerProps {
  initialCenter?: [number, number]
  initialZoom?: number
  value?: { lat: number; lng: number } | null
  onChange: (lat: number, lng: number, address?: string) => void
  enableReverseGeocoding?: boolean
  className?: string
  showConfirmButton?: boolean
  onConfirm?: (lat: number, lng: number, address?: string) => void
}

// Dynamically import the client-only component to avoid SSR issues with Leaflet
const MapPickerClient = dynamic(
    () => import("./MapPickerClient").then((mod) => mod.default),
    {
      ssr: false,
      loading: () => null,
    }
)

export default function MapPicker(props: MapPickerProps) {
  return <MapPickerClient {...props} />
}
