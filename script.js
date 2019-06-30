const searchForm = document.querySelector('#search-form');
const movie = document.querySelector('#movies');

function apiSearch(event){
    event.preventDefault();
    
    const searchText = document.querySelector('#search-text').value;
    const server = 'https://api.themoviedb.org/3/search/multi?api_key=b8af74b0a4e83b8c71f1deb2c4a36ca9&language=ru&query=' + searchText;
    movie.innerHTML = 'Загрузка...';
    requestApi(server)
        .then((result)=>{
          const output = JSON.parse(result);
          let inner = '';

          output.results.forEach(function(item){
              let = nameItem = item.name || item.title;
              console.log(nameItem);
              inner += `<div class="col-3">${nameItem}</div>`
          });

          movie.innerHTML = inner;
        })
        .catch((reason)=>{
          movie.innerHTML = 'Упс, что-то пошло не так!';
          console.log('error' + reason.status);
        })
    ;
    
};

searchForm.addEventListener('submit', apiSearch);

function requestApi(url){
    return new Promise ((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.open('GET', url);
        request.addEventListener('load', ()=>{
            if (request.status !== 200){
                reject({status: request.status});
                return;
            }

            resolve(request.response);
        });
        request.addEventListener('error', ()=>{
            reject({status: request.status});
        });
        request.send();
    });
    
  }

