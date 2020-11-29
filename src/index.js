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
  intersectingElement: document.querySelector('.intersectingElement'),
}

const apiService = new ApiService();
refs.form.addEventListener('submit', onImagesSearch);

function onImagesSearch(e) {
  e.preventDefault();
  apiService.query = e.currentTarget.elements.query.value;
  if (!apiService.query) {
    info({
      title: 'Write something for search',
    });
  } else if (apiService.query) {
    apiService.resetPage();
    apiService.fetchImages().then(images => {
    clearContainer();
    renderImages(images);
    });
  }
}

const onEntry = entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && apiService.query !== '') {
      onLoadMore();
    }
  })
}

const options = {
  rootMargin: '350px'
}

const observer = new IntersectionObserver(onEntry, options);
observer.observe(refs.intersectingElement);

function onLoadMore() {
  apiService.fetchImages().then(images => {
    renderImages(images);
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



