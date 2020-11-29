import './styles.css';
import './basicLightbox.min.css';
import ApiService from './apiService';
import imageCardTemplate from './image-card.hbs';
import * as basicLightbox from 'basiclightbox';
import '@pnotify/core/dist/BrightTheme.css';
import '@pnotify/core/dist/PNotify.css';
import { info, defaults } from '@pnotify/core';
defaults.delay = 1000;


const refs = {
  form: document.querySelector('#search-form'),
  galleryContainer: document.querySelector('.gallery'),
  btn: document.querySelector('.js-btn'),
}

const apiService = new ApiService();


refs.form.addEventListener('submit', onImagesSearch);
refs.btn.addEventListener('click', onLoadMore)

function onImagesSearch(e) {
  e.preventDefault();
  apiService.query = e.currentTarget.elements.query.value;
  if (!e.currentTarget.elements.query.value) {
    info({
      title: 'Write something for search',
    });
  } else if (e.currentTarget.elements.query.value) {
    apiService.resetPage();
    apiService.fetchImages().then(images => {
    clearContainer();
    renderImages(images);
    });
  }
}

function onLoadMore() {
  apiService.fetchImages().then(images => {
      const { y } = refs.galleryContainer.getBoundingClientRect();
      const screenHeight = document.documentElement.clientHeight;

      renderImages(images);

      window.scrollTo({
        top: screenHeight - y,
        behavior: 'smooth'
      });
  })
}

function renderImages(images) {
  const markup = imageCardTemplate(images);
  refs.galleryContainer.insertAdjacentHTML('beforeend', markup);
  refs.galleryContainer.addEventListener('click', onImageClick);
}

function clearContainer() {
  refs.galleryContainer.innerHTML = '';
}

function onImageClick(e) {
  const url = e.target.dataset.set;
  basicLightbox.create(
    `<img src="${url}" width="75vw">
  `).show()
}



