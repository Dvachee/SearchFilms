const searchForm = document.querySelector('#search-form');
const movie = document.querySelector('#movies');
const urlPoster = "http://image.tmdb.org/t/p/w500";

function apiSearch(event){
    event.preventDefault();
    
    const searchText = document.querySelector('#search-text').value;
    if (searchText.trim().length === 0){
      movie.innerHTML = '<h2 class="col-12 text-center text-danger">Поле поиска не должно быть пустым</h2>';
      return;
    }
    movie.innerHTML = '<div class="spinner"></div>';


    fetch('https://api.themoviedb.org/3/search/multi?api_key=b8af74b0a4e83b8c71f1deb2c4a36ca9&language=ru&query=' + searchText)
      .then((value)=>{
        if (value.status !== 200){
          return Promise.reject(value);
        }
        return value.json();
      })
      .then((output)=>{
        let inner = '';
        if (output.results.length === 0){
          inner ='<h2 class="col-12 text-center text-info">По вашему запросу ничего не найдено</h2>';
        }
        output.results.forEach(function(item){
          let = nameItem = item.name || item.title;
          const poster = item.poster_path ? urlPoster + item.poster_path : './img/noposter.jpg';
          let dataInfo = '';
          if (item.media_type !== 'person') dataInfo = `data-id="${item.id}" data-type="${item.media_type}"`;
          inner += `
            <div class="col-12 col-md-6 col-xl-3 item">
              <img src="${poster}" class="img_poster" alt="${nameItem}" ${dataInfo}>
              <h5>${nameItem}</h5>
            </div>
          `;
        });
        movie.innerHTML = inner;
        addEventMedia();
      })
      .catch((reason)=>{
        movie.innerHTML = 'Упс, что-то пошло не так!';
        console.error('error' + reason.status);
      })
};

searchForm.addEventListener('submit', apiSearch);

function addEventMedia(){
  const media = movie.querySelectorAll('img[data-id]');
    media.forEach(function(elem){
      elem.style.cursor = 'pointer';
      elem.addEventListener('click', showFullInfo);
    })
};

function showFullInfo(){
  let url = '';
  if (this.dataset.type === 'movie'){
    url = 'https://api.themoviedb.org/3/movie/' + this.dataset.id + '?api_key=b8af74b0a4e83b8c71f1deb2c4a36ca9&language=ru';
  } else if (this.dataset.type === 'tv'){
    url = 'https://api.themoviedb.org/3/tv/' + this.dataset.id + '?api_key=b8af74b0a4e83b8c71f1deb2c4a36ca9&language=ru';
  } else {
    movie.innerHTML = '<h2 class="col-12 text-center text-danger">Повторите позже</h2>';
  }


  fetch(url)
      .then((value)=>{
        if (value.status !== 200){
          return Promise.reject(value);
        }
        return value.json();
      })
      .then((output)=>{
        const poster = output.poster_path ? urlPoster + output.poster_path : './img/noposter.jpg';
        movie.innerHTML = `
          <h4 class="col-12 text-center text-info">${output.name || output.title}</h4>

          <div class="col-12 col-lg-4 text-center">
            <img class='fullInfoImg' src='${poster}' alt='${output.name || output.title}'>
            ${(output.homepage) ? `<p class="text-center"> <a href="${output.homepage}" target="_blank">Официальная страница</a></p>` : ''}
            ${(output.imdb_id) ? `<p class="text-center"> <a href="https://imdb.com/title/${output.imdb_id}" target="_blank">Страница на IMDB.com</a></p>` : ''}
          </div>

          <div class="col-lg-8 col-12 text-center">
            <p>Рейтинг: ${output.vote_average}</p>
            <p>Статус: ${output.status}</p>
            <p>Дата релиза: ${output.first_air_date || output.release_date}</p>

            ${(output.last_episode_to_air) ? `<p>${output.number_of_seasons} сезон(ов) ${output.last_episode_to_air.episode_number} серий вышло</p>` : ''}

            <p>Описание: ${output.overview}</p>

            <br>
            <div class="youtube"></div>

          </div>
        `;


        getVideo(this.dataset.type, this.dataset.id);


      })
      .catch((reason)=>{
        movie.innerHTML = 'Упс, что-то пошло не так!';
        console.error('error' + reason.status);
      })
}

document.addEventListener('DOMContentLoaded', function(){
  fetch('https://api.themoviedb.org/3/trending/all/week?api_key=b8af74b0a4e83b8c71f1deb2c4a36ca9&language=ru')
      .then((value)=>{
        if (value.status !== 200){
          return Promise.reject(value);
        }
        return value.json();
      })
      .then((output)=>{
        let inner = '<h4 class="col-12 text-center text-info">Популярные за неделю</h4>';
        if (output.results.length === 0){
          inner ='<h2 class="col-12 text-center text-info">По вашему запросу ничего не найдено</h2>';
        }
        output.results.forEach(function(item){
          let = nameItem = item.name || item.title;
          let mediaType = item.title ? 'movie' : 'tv';
          const poster = item.poster_path ? urlPoster + item.poster_path : './img/noposter.jpg';
          let dataInfo = `data-id="${item.id}" data-type="${mediaType}"`;
          inner += `
            <div class="col-12 col-md-6 col-xl-3 item">
              <img src="${poster}" class="img_poster" alt="${nameItem}" ${dataInfo}>
              <h5>${nameItem}</h5>
            </div>
          `;
        });
        movie.innerHTML = inner;
        addEventMedia();
      })
      .catch((reason)=>{
        movie.innerHTML = 'Упс, что-то пошло не так!';
        console.error('error' + reason.status);
      })
});


function getVideo(type, id){
  let youtube = movie.querySelector('.youtube');

  fetch(`https://api.themoviedb.org/3/${type}/${id}/videos?api_key=b8af74b0a4e83b8c71f1deb2c4a36ca9&language=ru`)
  .then((value) => {
    if (value.status !== 200){
      return Promise.reject(value);
    }
    return value.json();
  })
  .then((output) =>{
    let videoFrame = '<h5 class="text-info">Видео:</h5>';

    if (output.results.length === 0){
      videoFrame = '<p>К сожалению видео отсутствует</p>';
    }

    output.results.forEach((item) => {
      videoFrame += `<iframe width="560" height="315" src="https://www.youtube.com/embed/${item.key}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    });

    youtube.innerHTML = videoFrame;
  })
  .catch((reason) => {
    youtube.innerHTML = 'Видео отсутствует';
    console.error('error' + reason.status);
  });
}