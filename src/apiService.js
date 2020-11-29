const BASE_URL = 'https://pixabay.com/api';
const key = '19220688-570d8444e3e62b8d826a97ca4';
import '@pnotify/core/dist/BrightTheme.css';
import '@pnotify/core/dist/PNotify.css';
import { error } from '@pnotify/core';
import { info } from '@pnotify/core';

export default class ApiService {
  constructor() {
    this.searchQuery = ''
    this.page = 1
  }

  fetchImages() {
    const url = `${BASE_URL}/?image_type=photo&orientation=horizontal&q=${this.searchQuery}&page=${this.page}&per_page=12&key=${key}`;
    return fetch(url)
      .then(response => response.json())
      .then(data => {
      if (data.total === 0) {
        info({
        title: 'Not found! Try again!',
      });
      } else {
        this.incrementPage();
        return data.hits;
      }

      })
      .catch(this.onFetchError);
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  onFetchError(er) {
  error({
    title: 'Something went wrong! Try again',
  });
  }
}
