document.getElementById('cars').addEventListener('click', ({ target }) => {
    if (target.classList.contains('more')) {
        const toShow = target.parentElement.querySelector('.description');
        if (toShow.style.display == 'block') {
            toShow.style.display = 'none';
            target.textContent = 'Show More';
        } else {
            toShow.style.display = 'block';
            target.textContent = 'Hide Info'
        }
    }
})