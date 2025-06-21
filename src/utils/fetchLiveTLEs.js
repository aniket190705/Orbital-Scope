// utils/fetchLiveTLEs.js
const fetchLiveTLEs = async (
    noradIds = [
        "25544", // ISS
        "20580", // Hubble
        "43013", // NOAA-20
        "44714", // Starlink
        "25994",
        "40697",
        "49260",
        "28129",
        "37846",
    ]
) => {
    const baseUrl = "https://celestrak.org/NORAD/elements/gp.php";
    const tleData = [];

    for (const id of noradIds) {
        if (!id || typeof id !== "string") continue;

        try {
            const res = await fetch(`${baseUrl}?CATNR=${id}&FORMAT=TLE`);
            const text = await res.text();
            const lines = text.split("\n").map((line) => line.trim()).filter(Boolean);

            if (lines.length >= 3) {
                tleData.push({
                    id: lines[1].split(" ")[1]?.trim(), // Extract NORAD ID from TLE1
                    name: lines[0],
                    tle1: lines[1],
                    tle2: lines[2],
                });

            } else {
                console.warn(`Unexpected TLE format for ID ${id}:`, lines);
            }
        } catch (err) {
            console.error(`Failed to fetch TLE for ${id}:`, err);
        }
    }

    console.log("Fetched TLE Data:", tleData);
    return tleData;
};

export default fetchLiveTLEs;
