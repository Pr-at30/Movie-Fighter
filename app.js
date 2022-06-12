const fetchdata = async (searchItem) => {
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: '8115193f',
            s: searchItem
        }
    });

    if (response.data.Error) {
        return [];
    }

    return response.data.Search;
};

const root = document.querySelector('.autocomplete');
root.innerHTML = `
    <label><b>Search for a movie</b></label>
    <input class="input" />
    <div class="dropdown"> 
        <div class="dropdown-menu">
            <div class="dropdown-context results"></div>
        </div>
    </div>
`;

const input = document.querySelector('input');
const dropdown = document.querySelector('.dropdown');
const resultsWrapper = document.querySelector('.results');

/*

This will return a promise as it an async function
To get the array of movies we will have to treat 
it as an async function 

const onInput = (event) => {
    const movies = fetchdata(event.target.value);
    console.log(movies);
};

*/

const onInput = async (event) => {
    const movies = await fetchdata(event.target.value);

    if (!movies.length)  // If no movies are found
    {
        dropdown.classList.remove('is-active');
    }

    resultsWrapper.innerHTML = '';
    dropdown.classList.add('is-active');    // Show dropdown
    for (let movie of movies) {

        const option = document.createElement('a');
        const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;

        option.classList.add('dropdown-item');
        option.innerHTML = `
            <img src= "${imgSrc}" />
            ${movie.Title}
        `;

        option.addEventListener('click', () => {    // Update the search bar to the title of the movie we just clicked
            dropdown.classList.remove('is-active');
            input.value = movie.Title;
            onMovieSelect(movie);
        });

        resultsWrapper.appendChild(option);
    }
};

document.addEventListener('click', event => {
    if (!root.contains(event.target)) {
        dropdown.classList.remove('is-active');
    }
});

input.addEventListener('input', debounce(onInput, 500));


const onMovieSelect = async movie => {
    const response = await axios.get('http://www.omdbapi.com/', {
        params : {
            apikey: '8115193f',
            i: movie.imdbID
        }
    });
    
    document.querySelector('.summary').innerHTML = movieTemplate(response.data);
};

const movieTemplate = (movieDetail) => {
    return `
        <article class="media">
            
            <figure class="media-left">
                <p class="image">
                    <img src="${movieDetail.Poster}" />
                </p>
            </figure>

            <div class="media-content">
                <div class="content">
                    <h1>${movieDetail.Title}</h1>
                    <h4>${movieDetail.Genre}</h4>
                    <p>${movieDetail.Plot}</p>
                </div>
            </div>
        </article>

        <article class="notification is-primary">
            <p class="title">${movieDetail.Awards}</p>
            <p class="subtitle">Awards</p>
        </article>

        <article class="notification is-primary">
            <p class="title">${movieDetail.BoxOffice}</p>
            <p class="subtitle">BoxOffice</p>
        </article>

        <article class="notification is-primary">
            <p class="title">${movieDetail.Metascore}</p>
            <p class="subtitle">Metascore</p>
        </article>

        <article class="notification is-primary">
            <p class="title">${movieDetail.imdbRating}</p>
            <p class="subtitle">imdbRating</p>
        </article>

        <article class="notification is-primary">
            <p class="title">${movieDetail.imdbVotes}</p>
            <p class="subtitle">imdbVotes</p>
        </article>
    `;
};
