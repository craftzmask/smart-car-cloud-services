import React from "react";
import { Card, CardHeader, CardBody, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import { Icon } from "@iconify/react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { Car } from "../data/mock-data";

interface CarMapProps {
  car: Car;
  allCars: Car[];
  defaultView?: "current" | "all";
  showControls?: boolean;
}

// Custom car marker icon
const createCarIcon = () => {
  return L.divIcon({
    className: "car-marker",
    html: `
      <div class="car-marker-pulse"></div>
      <div class="car-marker-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"></path>
          <circle cx="7" cy="17" r="2"></circle>
          <path d="M9 17h6"></path>
          <circle cx="17" cy="17" r="2"></circle>
        </svg>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  });
};

export const CarMap: React.FC<CarMapProps> = ({ 
  car, 
  allCars, 
  defaultView = "current",
  showControls = true 
}) => {
  const [mapView, setMapView] = React.useState<"current" | "all">(defaultView);
  const carIcon = React.useMemo(() => createCarIcon(), []);
  
  // Center map on the selected car
  const mapCenter = [car.location.latitude, car.location.longitude] as [number, number];
  
  // Cars to display based on the selected view
  const carsToDisplay = mapView === "current" ? [car] : allCars;

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Car Location</h2>
        {showControls && (
          <div className="flex gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button
                  variant="flat"
                  endContent={<Icon icon="lucide:chevron-down" />}
                >
                  {mapView === "current" ? "Current Car" : "All Cars"}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Map view options"
                onAction={(key) => setMapView(key as "current" | "all")}
                selectedKeys={[mapView]}
                selectionMode="single"
              >
                <DropdownItem key="current">Current Car</DropdownItem>
                <DropdownItem key="all">All Cars</DropdownItem>
              </DropdownMenu>
            </Dropdown>
            
            <Button
              variant="flat"
              color="primary"
              startContent={<Icon icon="lucide:navigation" />}
            >
              Navigate
            </Button>
          </div>
        )}
      </CardHeader>
      <CardBody className="h-[400px] p-0 overflow-hidden relative">
        <MapContainer 
          center={mapCenter} 
          zoom={13} 
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
          className="map-container"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {carsToDisplay.map((carItem) => (
            <Marker 
              key={carItem.id}
              position={[carItem.location.latitude, carItem.location.longitude]}
              icon={carIcon}
            >
              <Popup>
                <div className="p-1">
                  <h3 className="font-medium">{carItem.model}</h3>
                  <p className="text-xs">{carItem.location.address}</p>
                  <div className="text-xs mt-1 flex items-center gap-1">
                    <Icon icon="lucide:battery-charging" className="text-success" />
                    <span>Battery: {carItem.battery}%</span>
                  </div>
                  <div className="text-xs mt-1 flex items-center gap-1">
                    <Icon icon="lucide:clock" className="text-default-500" />
                    <span>Updated: {new Date().toLocaleTimeString()}</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </CardBody>
    </Card>
  );
};