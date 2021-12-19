const form = document.querySelector('form');
const spanError = document.querySelector('.span-error');
const spinner = document.querySelector('.spinner');
const img = document.getElementById('image');
const imgUp = document.getElementById('uploadImage');
const num = document.getElementById('number');
const type = document.getElementById('type');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (type.value === 'person' && !isValidPesel(num.value)) {
        spanError.innerText = 'Niepoprawny numer PESEL';
        return;
    } else if (type.value === 'company' && !isValidNip(num.value)) {
        spanError.innerText = 'Niepoprawny numer NIP';
        return;
    };

    spanError.innerText = '';
    spinner.style.display = 'inline';

    const data = new FormData(e.target);
    const value = Object.fromEntries(data.entries());

    fetch('https://localhost:60001/Contractor/Save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(value),
    })
        .then(response => response.json())
        .then(data => {
            spinner.style.display = 'none';
            console.log('Success:', data);
            alert('Dziekujemy, formularz wysłany!');
        })
        .catch((error) => {
            console.error('Error:', error);
            spinner.style.display = 'none';
            window.location.href = './error.html';
        });

    form.reset();
    imgUp.remove();
})

const uploadImg = () => {
    const fReader = new FileReader();
    fReader.readAsDataURL(img.files[0]);
    fReader.onloadend = function (event) {
        imgUp.src = event.target.result;
        imgUp.style.height = '100vh';
        imgUp.style.width = '100vh';
    };
};

const isValidPesel = (pesel) => {
    let weight = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];
    let sum = 0;
    let controlNumber = parseInt(pesel.substring(10, 11));

    for (let i = 0; i < weight.length; i++) {
        sum += (parseInt(pesel.substring(i, i + 1)) * weight[i]);
    };
    sum = sum % 10;

    return (10 - sum) % 10 === controlNumber;
};

const isValidNip = (nip) => {
    if (typeof nip !== 'string')
        return false;

    nip = nip.replace(/[\ \-]/gi, '');

    let weight = [6, 5, 7, 2, 3, 4, 5, 6, 7];
    let sum = 0;
    let controlNumber = parseInt(nip.substring(9, 10));
    let weightCount = weight.length;
    for (let i = 0; i < weightCount; i++) {
        sum += (parseInt(nip.substr(i, 1)) * weight[i]);
    };

    return sum % 11 === controlNumber;
};