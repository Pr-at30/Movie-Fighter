const fetchdata = async (searchItem) => {
    const response = await axios.get('http://www.omdbapi.com/', {
        params : {
            apikey: '8115193f',
            s: searchItem
        }
    });

    if(response.data.Error)
    {
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

    resultsWrapper.innerHTML=''; 
    dropdown.classList.add('is-active');
    for(let movie of movies) {

        const option = document.createElement('a');
        const imgSrc = movie.Poster==='N/A' ? '' : movie.Poster ; 

        option.classList.add('dropdown-item');
        option.innerHTML = `
            <img src= "${imgSrc}" />
            ${movie.Title}
        `;
        resultsWrapper.appendChild(option);
    }
};


input.addEventListener('input', debounce(onInput, 500)); 

 
