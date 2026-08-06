import { Fragment, useEffect } from 'react';
import { MapContainer, TileLayer, Circle, CircleMarker, Popup, useMap } from 'react-leaflet';
import { contactColor } from '../utils/tradeContactColor';
import 'leaflet/dist/leaflet.css';
import './TradeContactsMap.css';

const UK_CENTER = [53.8, -2.2];
const MILES_TO_M = 1609.34;

// Recenter / zoom to fit whichever contacts are plotted.
function FitBounds({ points }) {
  const map = useMap();
  useEffect(() => {
    if (points.length === 1) {
      map.setView(points[0], 10);
    } else if (points.length > 1) {
      map.fitBounds(points, { padding: [50, 50] });
    }
  }, [points, map]);
  return null;
}

function PriceRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="tc-map-pop__row">
      <span className="tc-map-pop__row-label">{label}</span>
      <strong className="tc-map-pop__row-value">{value}</strong>
    </div>
  );
}

export default function TradeContactsMap({ contacts }) {
  const located = contacts.filter((c) => c.latitude != null && c.longitude != null);
  const points = located.map((c) => [c.latitude, c.longitude]);

  return (
    <div className="tc-map">
      <MapContainer center={UK_CENTER} zoom={6} scrollWheelZoom className="tc-map__canvas">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds points={points} />
        {located.map((c) => {
          const center = [c.latitude, c.longitude];
          const radiusM = (c.mile_radius || 0) * MILES_TO_M;
          const color = contactColor(c.id || c.name);
          const services = [
            c.fabrication && 'Fabrication',
            c.templating && 'Templating',
            c.installation && 'Installation',
          ].filter(Boolean).join(' · ');
          return (
            <Fragment key={c.id}>
              {radiusM > 0 && (
                <Circle
                  center={center}
                  radius={radiusM}
                  pathOptions={{ color, fillColor: color, fillOpacity: 0.1, weight: 1 }}
                />
              )}
              <CircleMarker
                center={center}
                radius={9}
                pathOptions={{ color: '#ffffff', weight: 2, fillColor: color, fillOpacity: 1 }}
              >
                <Popup>
                  <div className="tc-map-pop">
                    <div className="tc-map-pop__name">{c.name}</div>
                    {c.company && c.company !== c.name && (
                      <div className="tc-map-pop__company">{c.company}</div>
                    )}
                    {(c.address || c.county) && (
                      <div className="tc-map-pop__loc">
                        {[c.address, c.county, c.postcode].filter(Boolean).join(', ')}
                      </div>
                    )}
                    {c.phone && (
                      <a href={`tel:${c.phone}`} className="tc-map-pop__phone">{c.phone}</a>
                    )}
                    {services && <div className="tc-map-pop__services">{services}</div>}
                    {c.mile_radius != null && (
                      <div className="tc-map-pop__radius">Travels up to {c.mile_radius} miles</div>
                    )}
                    {(c.price_1_slab || c.price_2_slab || c.price_3_slab || c.price_4_slab || c.sink_cutout || c.hob_cutout || c.extra_charges) && (
                      <div className="tc-map-pop__prices">
                        <div className="tc-map-pop__prices-title">Guideline pricing</div>
                        <PriceRow label="1 slab" value={c.price_1_slab} />
                        <PriceRow label="2 slabs" value={c.price_2_slab} />
                        <PriceRow label="3 slabs" value={c.price_3_slab} />
                        <PriceRow label="4 slabs" value={c.price_4_slab} />
                        <PriceRow label="Sink cut-out" value={c.sink_cutout} />
                        <PriceRow label="Hob cut-out" value={c.hob_cutout} />
                        <PriceRow label="Extra" value={c.extra_charges} />
                      </div>
                    )}
                  </div>
                </Popup>
              </CircleMarker>
            </Fragment>
          );
        })}
      </MapContainer>
    </div>
  );
}
