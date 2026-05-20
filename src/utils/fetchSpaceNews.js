const fetchSpaceNews = async () => {
    const res = await fetch("https://api.spaceflightnewsapi.net/v4/articles?limit=25");

    if (!res.ok) {
        throw new Error(`News API responded with ${res.status}`);
    }

    const data = await res.json();
    return data.results ?? [];
};
export default fetchSpaceNews;
