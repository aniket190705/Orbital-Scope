// fetchLiveTLEs.js
const fetchLiveTLEs = async (noradIds = []) => {
    const baseUrl = "https://celestrak.org/NORAD/elements/gp.php";
    const tleData = [];

    for (const id of noradIds) {
        try {
            const res = await fetch(`${baseUrl}?CATNR=${id}&FORMAT=JSON`);
            const [sat] = await res.json();
            if (sat && sat.TLE_LINE1 && sat.TLE_LINE2) {
                tleData.push({
                    id: sat.NORAD_CAT_ID.toString(),
                    name: sat.OBJECT_NAME,
                    tle1: sat.TLE_LINE1.trim(),
                    tle2: sat.TLE_LINE2.trim(),
                });
            }
        } catch (err) {
            console.error(`Failed to fetch TLE for ${id}:`, err);
        }
    }

    return tleData;
};

export default fetchLiveTLEs;
