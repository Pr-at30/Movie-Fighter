const autoCompleteConfig = {    // Reusable
    renderOption(movie) {

        const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
        return `
            <img src= "${imgSrc}" />
            ${movie.Title} (${movie.Year})
        `;
    },

    inputvalue(movie) {
        return movie.Title;
    },

    async fetchData(searchItem) {
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
    },
};

createAutoComplete({
    ...autoCompleteConfig,  // spread

    root: document.querySelector('#left-autocomplete'),

    onOptionSelect(movie) {
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie, document.querySelector('#left-summary'),'left');
    },
});

createAutoComplete({
    ...autoCompleteConfig,  // spread

    root: document.querySelector('#right-autocomplete'),

    onOptionSelect(movie) {
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie, document.querySelector('#right-summary'),'right');
    },
});

let leftMovie;
let rightMovie;

const onMovieSelect = async (movie, summaryElement, side) => {
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: '8115193f',
            i: movie.imdbID
        }
    });

    summaryElement.innerHTML = movieTemplate(response.data);
    
    if(side==='left')
    {   
        leftMovie=response.data;
    }
    else
    {
        rightMovie=response.data;
    }

    if(leftMovie && rightMovie)
    {
        runComparison();
    }
};

const runComparison = () => {
    // console.log("Running comparison");
    const leftSideStats = document.querySelectorAll('#left-summary .notification');
    const rightSideStats = document.querySelectorAll('#right-summary .notification');

    leftSideStats.forEach((leftStat,index)=> {
        const rightStat = rightSideStats[index];
        const leftSideValue = leftStat.dataset.value;
        const rightSideValue = rightStat.dataset.value; 

        if(leftSideValue > rightSideValue)
        {
            leftStat.classList.remove('is-primary');
            leftStat.classList.add('is-warning');
        }
        else
        {
            rightStat.classList.remove('is-primary');
            rightStat.classList.add('is-warning');
        }
    });
};



const movieTemplate = (movieDetail) => {

    const dollars = parseInt(movieDetail.BoxOffice.replace(/\$/g,'').replace(/,/g, ''));
    const metascore = parseInt(movieDetail.Metascore);
    const imdbRating = parseFloat(movieDetail.imdbRating);
    const imdbvotes = parseInt(movieDetail.imdbVotes.replace(/,/g,''));
    let count = 0 ;
    const awards = movieDetail.Awards.split(' ').forEach((word) =>{
        const val = parseInt(word);
        if(!isNaN(val))
        {
            count+=val;
        }
    });
    // console.log(count);

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

        <article data-value=${count} class="notification is-primary">
            <p class="title">${movieDetail.Awards}</p>
            <p class="subtitle">Awards</p>
        </article>

        <article data-value=${dollars} class="notification is-primary">
            <p class="title">${movieDetail.BoxOffice}</p>
            <p class="subtitle">BoxOffice</p>
        </article>

        <article data-value=${metascore} class="notification is-primary">
            <p class="title">${movieDetail.Metascore}</p>
            <p class="subtitle">Metascore</p>
        </article>

        <article data-value=${imdbRating} class="notification is-primary">
            <p class="title">${movieDetail.imdbRating}</p>
            <p class="subtitle">imdbRating</p>
        </article>

        <article data-value=${imdbvotes} class="notification is-primary">
            <p class="title">${movieDetail.imdbVotes}</p>
            <p class="subtitle">imdbVotes</p>
        </article>
    `;
};
