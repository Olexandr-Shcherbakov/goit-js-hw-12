
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import iziToast from 'izitoast';

import { getImagesByQuery } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions.js';


const form = document.querySelector('.search-form');
const loadMoreBtn = document.querySelector('.load-more');

let query = '';
let page = 1;
let totalHits = 0;

form.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMore);

async function onSearch(e) {
  e.preventDefault();
  query = e.target.elements.searchQuery.value.trim();
  if (!query) {
    iziToast.error({ message: 'Please enter a search query!' });
    return;
  }

  page = 1;
  clearGallery();
  hideLoadMoreButton();

  try {
    showLoader();
    const data = await getImagesByQuery(query, page);
    hideLoader();

    if (data.hits.length === 0) {
      iziToast.error({ message: 'No images found. Try another query.' });
      return;
    }

    totalHits = data.totalHits;
    createGallery(data.hits);

    if (totalHits > 15) {
      showLoadMoreButton();
    }
  } catch (error) {
    iziToast.error({ message: 'Something went wrong!' });
  }
}

async function onLoadMore() {
  page += 1;

  try {
    showLoader();
    const data = await getImagesByQuery(query, page);
    hideLoader();

    createGallery(data.hits);

    smoothScroll();

    const totalPages = Math.ceil(totalHits / 15);
    if (page >= totalPages) {
      hideLoadMoreButton();
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
      });
    }
  } catch (error) {
    iziToast.error({ message: 'Something went wrong!' });
  }
}

function smoothScroll() {
  const { height: cardHeight } =
    document.querySelector('.gallery').firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
