const BASE_URL = "https://api.themoviedb.org/3";
const DEFAULT_PARAMS = "include_adult=false&language=fr-FR";
const API_KEY = process.env.VITE_API_TOKEN;

export async function apiFetch(endpoint, queryParams = {}, options = {}) {
  console.log(endpoint, queryParams, options);
  const queryString = new URLSearchParams({
    ...DEFAULT_PARAMS.split('&').reduce((acc, param) => {
      const [key, value] = param.split('=');
      acc[key] = encodeURIComponent(value);
      return acc;
    }, {}),
    ...Object.keys(queryParams).reduce((acc, key) => {
      acc[key] = encodeURIComponent(queryParams[key]); 
      return acc;
    }, {}),
  }).toString();

  const url = `${BASE_URL}${endpoint}?${queryString}`;

  try {
    console.log("Requête API :", url);

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur lors de l'appel API :", error);
    throw error;
  }
}
