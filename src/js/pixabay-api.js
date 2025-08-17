import axios from 'axios';

const API_KEY = '51642413-09ec9e4a1ede3d4c71955ca94'; 
const BASE_URL = 'https://pixabay.com/api/';

export async function getImagesByQuery(query, page) {
  const params = {
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 15,
    page,
  };

  try {
    const { data } = await axios.get(BASE_URL, { params });
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
}










