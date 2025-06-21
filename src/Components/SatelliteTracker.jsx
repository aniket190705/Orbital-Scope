import { useEffect } from "react";
import {
  Cartesian3,
  Color,
  LabelStyle,
  VerticalOrigin,
  Cartesian2,
  SampledPositionProperty,
  JulianDate,
} from "cesium";
import * as satellite from "satellite.js";

const SatelliteTracker = ({ viewer, selectedSatellites, setLiveData }) => {
  useEffect(() => {
    if (!viewer) return;

    const entities = [];

    selectedSatellites.forEach((sat) => {
      const satId = sat.tle1.split(" ")[1]?.trim()?.slice(0, -1); // NORAD ID
      const satrec = satellite.twoline2satrec(sat.tle1, sat.tle2);

      // Orbit path using SampledPositionProperty
      const positionProperty = new SampledPositionProperty();
      const now = new Date();
      const orbitDurationMin = 90;
      const stepSeconds = 30;

      for (
        let i = (-orbitDurationMin * 60) / 2;
        i <= (orbitDurationMin * 60) / 2;
        i += stepSeconds
      ) {
        const time = new Date(now.getTime() + i * 1000);
        const { position } = satellite.propagate(satrec, time);
        if (!position) continue;

        const gmst = satellite.gstime(time);
        const posGd = satellite.eciToGeodetic(position, gmst);

        const lon = satellite.degreesLong(posGd.longitude);
        const lat = satellite.degreesLat(posGd.latitude);
        const alt = posGd.height * 1000;

        const julian = JulianDate.fromDate(time);
        const cartesian = Cartesian3.fromDegrees(lon, lat, alt);
        positionProperty.addSample(julian, cartesian);
      }

      // Create satellite entity
      const entity = viewer.entities.add({
        id: satId,
        name: sat.name.trim(),
        position: positionProperty,
        point: {
          pixelSize: 10,
          color: Color.YELLOW,
        },
        label: {
          text: sat.name.trim(),
          font: "13pt sans-serif",
          fillColor: Color.WHITE,
          style: LabelStyle.FILL_AND_OUTLINE,
          outlineWidth: 2,
          verticalOrigin: VerticalOrigin.BOTTOM,
          pixelOffset: new Cartesian2(0, -12),
          showBackground: true,
          backgroundColor: Color.BLACK.withAlpha(0.5),
        },
        path: {
          show: true,
          leadTime: 0,
          trailTime: 5400, // 90 minutes
          width: 2,
          material: Color.CYAN.withAlpha(0.6),
        },
      });

      // Update live position, speed, and label text
      const interval = setInterval(() => {
        const now = new Date();
        const { position, velocity } = satellite.propagate(satrec, now);
        if (!position || !velocity) return;

        const gmst = satellite.gstime(now);
        const geo = satellite.eciToGeodetic(position, gmst);

        const lat = satellite.degreesLat(geo.latitude).toFixed(2);
        const lon = satellite.degreesLong(geo.longitude).toFixed(2);
        const alt = (geo.height * 1000).toFixed(0) / 1000;
        const speed =
          Math.sqrt(velocity.x ** 2 + velocity.y ** 2 + velocity.z ** 2) * 3600; // km/h

        // Update label text on the globe
        entity.label.text = `${sat.name.trim()}\nAlt: ${alt} km \nSpeed: ${speed.toFixed(
          0
        )} km/h`;

        // Update external live data store (for sidebar)
        setLiveData((prev) => ({
          ...prev,
          [satId]: { lat, lon, alt, speed: speed.toFixed(0) },
        }));
      }, 3000);

      entities.push({ entity, interval });
    });

    return () => {
      entities.forEach(({ entity, interval }) => {
        viewer.entities.remove(entity);
        clearInterval(interval);
      });
    };
  }, [viewer, selectedSatellites, setLiveData]);

  return null;
};

export default SatelliteTracker;
