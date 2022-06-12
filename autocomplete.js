const createAutoComplete = ({
    root,
    renderOption,
    onOptionSelect,
    inputvalue,
    fetchData
}) => {

    root.innerHTML = `
    <label><b>Search</b></label>
    <input class="input" />
    <div class="dropdown"> 
        <div class="dropdown-menu">
            <div class="dropdown-context results"></div>
        </div>
    </div>
`;

    // Just to look inside the root element
    const input = root.querySelector('input');
    const dropdown = root.querySelector('.dropdown');
    const resultsWrapper = root.querySelector('.results');

    const onInput = async (event) => {
        const items = await fetchData(event.target.value);

        if (!items.length)  // If no items are found
        {
            dropdown.classList.remove('is-active');
        }

        resultsWrapper.innerHTML = '';
        dropdown.classList.add('is-active');    // Show dropdown

        for (let item of items) {

            const option = document.createElement('a');

            option.classList.add('dropdown-item');

            option.innerHTML = renderOption(item);

            option.addEventListener('click', () => {    // Update the search bar to the title of the item we just clicked
                dropdown.classList.remove('is-active');
                input.value = inputvalue(item);
                onOptionSelect(item);
            });

            resultsWrapper.appendChild(option);
        }
    };

    input.addEventListener('input', debounce(onInput, 500));

    document.addEventListener('click', event => {
        if (!root.contains(event.target)) {
            dropdown.classList.remove('is-active');
        }
    });
};