// utils/fetchSpaceNews.js
const fetchSpaceNews = async () => {
    const res = await fetch("https://api.spaceflightnewsapi.net/v4/articles?limit=25");
    const data = await res.json();
    console.log("Fetched Space News:", data.results);
    return data.results;
};
fetchSpaceNews();
export default fetchSpaceNews;
