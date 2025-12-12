import type { CarLocation } from "@/domain/types";
import GoogleMapReact from "google-map-react";
import { MapPin } from "lucide-react";

export default function SimpleMap({
  carLocation,
}: {
  carLocation: CarLocation;
}) {
  // Debug: log incoming location
  console.log("[Map] carLocation", carLocation);

  const apiKey =
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY ||
    "AIzaSyCQJ3PrlW50AKN8sFkbiIKPG9B46ai1bfA";

  const lat = Number(carLocation?.latitude);
  const lng = Number(carLocation?.longitude);

  if (
    !carLocation ||
    !Number.isFinite(lat) ||
    !Number.isFinite(lng)
  ) {
    console.warn("[Map] missing location", carLocation);
    return (
      <div className="h-80 w-full flex items-center justify-center text-slate-500 text-sm">
        No location data available.
      </div>
    );
  }

  const defaultProps = {
    center: {
      lat,
      lng,
    },
    zoom: 11,
  };

  return (
    // Important! Always set the container height explicitly
    <div className="h-80 w-full">
      <GoogleMapReact
        bootstrapURLKeys={{ key: apiKey }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
      >
        <AnyReactComponent
          lat={carLocation?.latitude ?? 0}
          lng={carLocation?.longitude ?? 0}
        />
      </GoogleMapReact>
    </div>
  );
}

function AnyReactComponent() {
  return <MapPin className="text-rose-600" />;
}
