import { useEffect } from "react";
import {
  Cartesian3,
  ConstantPositionProperty,
  Color,
  LabelStyle,
  VerticalOrigin,
  Cartesian2,
} from "cesium";

import * as satellite from "satellite.js";
import satelliteData from "../data/satellites";

const SatelliteTracker = ({ viewer, selectedSatellites }) => {
  useEffect(() => {
    if (!viewer) return;

    const entities = [];

    selectedSatellites.forEach((id) => {
      const sat = satelliteData.find((s) => s.id === id);
      if (!sat) return;

      const satrec = satellite.twoline2satrec(sat.tle1, sat.tle2);
      const now = new Date();
      const { position } = satellite.propagate(satrec, now);
      const gmst = satellite.gstime(now);
      const posGd = satellite.eciToGeodetic(position, gmst);

      const longitude = satellite.degreesLong(posGd.longitude);
      const latitude = satellite.degreesLat(posGd.latitude);
      const height = posGd.height * 1000;

      const entity = viewer.entities.add({
        id: sat.id, // ✅ This is the key!
        name: sat.name,
        position: Cartesian3.fromDegrees(longitude, latitude, height),
        point: { pixelSize: 10, color: Color.fromCssColorString(sat.color) },
        label: {
          text: sat.name,
          font: "14pt sans-serif",
          fillColor: Color.WHITE,
          style: LabelStyle.FILL_AND_OUTLINE,
          outlineWidth: 2,
          verticalOrigin: VerticalOrigin.BOTTOM,
          pixelOffset: new Cartesian2(0, -12),
        },
      });

      // Update every 3s
      const interval = setInterval(() => {
        const now = new Date();
        const { position } = satellite.propagate(satrec, now);
        const gmst = satellite.gstime(now);
        const posGd = satellite.eciToGeodetic(position, gmst);

        const lon = satellite.degreesLong(posGd.longitude);
        const lat = satellite.degreesLat(posGd.latitude);
        const alt = posGd.height * 1000;

        entity.position = new ConstantPositionProperty(
          Cartesian3.fromDegrees(lon, lat, alt)
        );
      }, 3000);

      entities.push({ entity, interval });
    });

    return () => {
      entities.forEach(({ entity, interval }) => {
        viewer.entities.remove(entity);
        clearInterval(interval);
      });
    };
  }, [viewer, selectedSatellites]);

  return null;
};

export default SatelliteTracker;
