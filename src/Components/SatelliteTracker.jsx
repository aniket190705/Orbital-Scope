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

const colorPalette = [
  Color.RED,
  Color.GREEN,
  Color.YELLOW,
  Color.CYAN,
  Color.ORANGE,
  Color.MAGENTA,
  Color.BLUE,
  Color.PINK,
];

const SatelliteTracker = ({ viewer, selectedSatellites }) => {
  useEffect(() => {
    if (!viewer || selectedSatellites.length === 0) return;

    const entities = [];

    selectedSatellites.forEach((sat, index) => {
      if (!sat.tle1 || !sat.tle2) return;

      const satrec = satellite.twoline2satrec(sat.tle1, sat.tle2);

      const now = new Date();
      const positionAndVelocity = satellite.propagate(satrec, now);
      const gmst = satellite.gstime(now);
      const posGd = satellite.eciToGeodetic(positionAndVelocity.position, gmst);

      const longitude = satellite.degreesLong(posGd.longitude);
      const latitude = satellite.degreesLat(posGd.latitude);
      const height = posGd.height * 1000; // meters

      const velocityEci = positionAndVelocity.velocity;
      const speedKps = Math.sqrt(
        velocityEci.x ** 2 + velocityEci.y ** 2 + velocityEci.z ** 2
      ); // km/s
      const speedKph = speedKps * 3600;

      const entity = viewer.entities.add({
        id: sat.id || `sat-${index}`,
        name: sat.name,
        position: Cartesian3.fromDegrees(longitude, latitude, height),
        point: {
          pixelSize: 10,
          color: colorPalette[index % colorPalette.length],
        },
        label: {
          text: `${sat.name.trim()}\nAlt: ${height.toFixed(
            0
          )} m\nSpeed: ${speedKph.toFixed(0)} km/h`,
          font: "12pt monospace",
          fillColor: Color.WHITE,
          style: LabelStyle.FILL_AND_OUTLINE,
          outlineWidth: 2,
          verticalOrigin: VerticalOrigin.BOTTOM,
          pixelOffset: new Cartesian2(0, -12),
        },
      });

      // Interval for live update
      const interval = setInterval(() => {
        const now = new Date();
        const posVel = satellite.propagate(satrec, now);
        const gmst = satellite.gstime(now);
        const geo = satellite.eciToGeodetic(posVel.position, gmst);

        const lon = satellite.degreesLong(geo.longitude);
        const lat = satellite.degreesLat(geo.latitude);
        const alt = geo.height * 1000;

        const vel = posVel.velocity;
        const spd = Math.sqrt(vel.x ** 2 + vel.y ** 2 + vel.z ** 2) * 3600;

        entity.position = new ConstantPositionProperty(
          Cartesian3.fromDegrees(lon, lat, alt)
        );

        entity.label.text = `${sat.name.trim()}\nAlt: ${alt.toFixed(
          0
        )} m\nSpeed: ${spd.toFixed(0)} km/h`;
      }, 1500);

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
