import React from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker
} from "react-simple-maps";
import { Tooltip } from "react-tooltip";

// Use a reliable CDN URL for the world map topology
const geoUrl = "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";

export default function GeoThreatMap({ logs }) {
  // Extract unique threat markers from logs
  const markers = [];
  const seenIps = new Set();

  logs.forEach(log => {
    if (log.enriched_data && log.enriched_data.threat_intel_match) {
      const ip = (log.source && log.source.ip) || log.raw.client_ip || log.raw.src_ip || log.source_ip;
      if (!seenIps.has(ip)) {
        seenIps.add(ip);
        markers.push({
          markerOffset: -15,
          name: `${ip} | Actor: ${log.enriched_data.actor} | Country: ${log.enriched_data.country}`,
          coordinates: [log.enriched_data.lon, log.enriched_data.lat]
        });
      }
    }
  });

  return (
    <div className="relative w-full h-[400px] bg-[#0A0E17] rounded-xl border border-siem-border overflow-hidden">
      <div className="absolute top-4 left-4 z-10 flex flex-col">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
          Global Threat Map
        </h2>
        <span className="text-xs text-gray-400">AWS-Inspired Live Geo-Enrichment Visualization</span>
      </div>
      
      <ComposableMap 
         projectionConfig={{ scale: 140 }}
         className="w-full h-full opacity-80"
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#1A2234"
                stroke="#2A3441"
                strokeWidth={0.5}
                style={{
                  default: { outline: "none" },
                  hover: { fill: "#24314A", outline: "none" },
                  pressed: { fill: "#24314A", outline: "none" }
                }}
              />
            ))
          }
        </Geographies>

        {markers.map(({ name, coordinates, markerOffset }) => (
          <Marker key={name} coordinates={coordinates}>
            <circle 
               r={6} 
               fill="#EF4444" 
               className="animate-pulse"
               data-tooltip-id="geo-tooltip"
               data-tooltip-content={name}
            />
            <circle r={3} fill="#FFFFFF" />
          </Marker>
        ))}
      </ComposableMap>
      
      <Tooltip 
        id="geo-tooltip" 
        style={{ backgroundColor: "rgba(17, 24, 39, 0.95)", border: "1px solid #EF4444", borderRadius: "8px", fontWeight: "bold" }} 
      />
    </div>
  );
}
