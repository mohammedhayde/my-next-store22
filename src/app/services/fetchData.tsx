async function fetchData(url: string | URL | Request) {
    const res = await fetch(url);
    const data = await res.json();
    return data;
  }
  
  export default fetchData;
  