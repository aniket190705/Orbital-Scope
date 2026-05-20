import * as satellite from "satellite.js";

export function predictSatellitePasses(tle1, tle2, observer) {
  const satrec = satellite.twoline2satrec(tle1, tle2);
  const observerGd = {
    latitude: satellite.degreesToRadians(observer.lat),
    longitude: satellite.degreesToRadians(observer.lng),
    height: observer.altitudeKm ?? 0,
  };

  const startTime = Date.now();
  const endTime = startTime + 24 * 60 * 60 * 1000;
  const stepSeconds = 60;
  const passes = [];
  let activePass = null;

  for (let timestamp = startTime; timestamp <= endTime; timestamp += stepSeconds * 1000) {
    const time = new Date(timestamp);
    const propagation = satellite.propagate(satrec, time);
    const position = propagation.position;

    if (!position) {
      continue;
    }

    const gmst = satellite.gstime(time);
    const positionEcf = satellite.eciToEcf(position, gmst);
    const lookAngles = satellite.ecfToLookAngles(observerGd, positionEcf);
    const elevationDeg = satellite.radiansToDegrees(lookAngles.elevation);
    const azimuthDeg = satellite.radiansToDegrees(lookAngles.azimuth);

    if (elevationDeg > 0) {
      if (!activePass) {
        activePass = {
          startTime: time.toISOString(),
          startAzimuthDeg: Number(azimuthDeg.toFixed(2)),
          maxElevationDeg: Number(elevationDeg.toFixed(2)),
          maxElevationTime: time.toISOString(),
          endTime: time.toISOString(),
          endAzimuthDeg: Number(azimuthDeg.toFixed(2)),
        };
      }

      if (elevationDeg > activePass.maxElevationDeg) {
        activePass.maxElevationDeg = Number(elevationDeg.toFixed(2));
        activePass.maxElevationTime = time.toISOString();
      }

      activePass.endTime = time.toISOString();
      activePass.endAzimuthDeg = Number(azimuthDeg.toFixed(2));
      continue;
    }

    if (activePass) {
      const durationMinutes =
        (new Date(activePass.endTime).getTime() -
          new Date(activePass.startTime).getTime()) /
        60000;

      passes.push({
        ...activePass,
        durationMinutes: Number(durationMinutes.toFixed(2)),
      });
      activePass = null;
    }
  }

  if (activePass) {
    const durationMinutes =
      (new Date(activePass.endTime).getTime() -
        new Date(activePass.startTime).getTime()) /
      60000;

    passes.push({
      ...activePass,
      durationMinutes: Number(durationMinutes.toFixed(2)),
    });
  }

  return passes.slice(0, 5);
}
