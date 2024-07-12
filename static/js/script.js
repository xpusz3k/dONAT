// PAGINATION

const firstPage = document.querySelector('.page-first')
const secondPage = document.querySelector('.page-second')

const pagination = document.querySelectorAll('#pagination-box')

pagination.forEach((button) => {
    button.addEventListener('click', () => setPagination(button))
})

function setPagination(page) {
    checkInputs()

    if (errorHandler == true) return

    clearPagination()
    if (!page.classList.contains('active')) {
        page.classList.add('active')
    }
    checkPagination()
}

function clearPagination() {
    pagination.forEach(button => {
        button.classList.remove('active')
    })
    firstPage.classList.remove('show')
    secondPage.classList.remove('show')
}

function checkPagination() {
    if (pagination[0].classList.contains('active')) {
        firstPage.classList.add('show')
    } else {
        secondPage.classList.add('show')
    }
}



let errorHandler = false

function checkInputs() {
    const inputName = document.querySelector('#input-name')
    const inputMessage = document.querySelector('#input-message')

    if (inputName.value.length <= 0 || inputMessage.value.length <= 0) {
        errorHandler = true
    } else {
        errorHandler = false
    }
}

function nextPagination() {
    checkInputs()

    if (errorHandler == true) return

    clearPagination()
    pagination[0].classList.remove('active')
    pagination[1].classList.add('active')
    checkPagination()
}

const continueBtn = document.querySelector('#continue')

continueBtn.addEventListener('click', () => nextPagination())

const paymentInputValue = document.querySelector('#payment-input-value')

paymentInputValue.addEventListener('input', () => updateInput())

function updateInput() {
    if (parseInt(paymentInputValue.value) >= 1) return
    
    paymentInputValue.value = ''
}




const paymentBoxes = document.querySelectorAll('.payment-box')

paymentBoxes.forEach((button) => {
    button.addEventListener('click', () => setMethod(button))
})

function setMethod(method) {
    clearMethods()
    if (!method.classList.contains('active')) {
        method.classList.add('active')
    }
}

function clearMethods() {
    paymentBoxes.forEach(button => {
        button.classList.remove('active')
    })
}
















const paymentButton = document.getElementById("payment-button");

paymentButton.addEventListener("click", async () => {
    const inputName = document.getElementById("input-name").value;
    const inputMessage = document.getElementById("input-message").value;
    const paymentValue = document.getElementById("payment-input-value").value;
    const activePaymentBox = document.querySelector(".payment-box.active");

    if (paymentValue == '') return
    
    const paymentType = activePaymentBox.querySelector("span").textContent;
    
    const requestData = {
        nickname: inputName,
        message: inputMessage,
        value: paymentValue,
        donationType: paymentType
    };
    
    try {
        const response = await fetch("/save-order", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestData)
        });
        
        
    } catch (error) {
        console.error("Error saving order:", error);
    }

    const body = document.querySelector('body')

    const popup = document.createElement('div')
    popup.classList.add('success-popup')

    const password = Math.floor(Math.random() * 9999999)

    popup.innerHTML = `
        <div class="top">
            <h2>DZIĘKUJEMY ZA DOKONANIE PŁATNOŚCI</h2>
        </div>
        <p>Zaloguj się do swojego konta za pomocą tych danych:</p>
        <div class="row">
            <span>LOGIN: ${inputName}</span><span>HASŁO: ${password}</span>
        </div>
    `

    body.appendChild(popup)

    const userData = {
        nickname: inputName,
        password: password.toString()
    }

    try {
        const response = await fetch("/create-user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json();
    } catch (error) {
        console.log(`🔥 An error occured with set Data to database, ${error}`);
    }
});

let slider = 1

async function loadImages() {
    const sliders = document.querySelector('.banners-slider')
    
    try {
        const response = await fetch("/get-ads");
        const data = await response.json();

        for (const image in data) {
            const box = document.createElement('div')

            box.classList.add('banner')
            box.id = data[image].adID
            box.innerHTML = `<span>${data[image].text}</span>`
            box.style.background = `url(${data[image].image})`;
            box.style.backgroundSize = 'cover'
            box.style.backgroundPosition = 'center'

            sliders.appendChild(box)
        }
    } catch (error) {
        console.log(`🔥 An error occured with get Data from database, ${error}`);
    }

    const sliderWidth = sliders.scrollWidth / sliders.children.length
    setInterval(() => {
        
        sliders.scrollLeft = sliderWidth * slider
        
        if (slider >= sliders.children.length) {
            slider = 1
            sliders.scrollLeft = 0
        } else {
            slider++
        }
    }, 2500);
}

window.onload = loadImages()

const maintenance_box = document.querySelector('.maintenance-break')

async function getMaintenanceStatus() {
    try {
        const response = await fetch("/get-maintenance-status", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();

        if (data && !data.toggled) {
            maintenance_box.classList.add("active");
        }
    } catch (error) {
        console.log(`🔥 An error occured with get Data from database, ${error}`);
    }
}

 document.getElementById('payment-form').addEventListener('submit', async (event) => {
            event.preventDefault();

            const amount = document.getElementById('amount').value;

            const response = await fetch('/payments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: amount * 100, // przelicz na najmniejszą jednostkę waluty
                    paymentMethod: {} // Tutaj dodaj szczegóły płatności
                }),
            });

            const result = await response.json();
            console.log(result);
            // Obsługa odpowiedzi z Adyen
        });