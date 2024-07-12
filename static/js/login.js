const log_form = document.querySelector('#log_form')

log_form.addEventListener('submit', async function (event) {
    event.preventDefault()

    const nameInput = document.querySelector('#log_nickname')
    const passwordInput = document.querySelector('#log_password')

    if (nameInput.value == '' || passwordInput.value == '') return

    login(nameInput.value, passwordInput.value)
})

async function login(name, password) {
    try {
        const response = await fetch(`/check-user?nickname=${name}`)

        if (response.ok) {
            const user = await response.json();

            if (user && user.password === password) {
                localStorage.setItem('user', name)
            } else {
                console.log(`🔥 An error occured with get Data from database, Wrong credentials`);
            }
        } else {
            console.log(`🔥 An error occured with get Data from database, ${response.statusText}`);
        }
    } catch (error) {
        console.log(`🔥 An error occured with get Data from database, ${error}`);
    }
}

setInterval(() => {
    checkUser()
}, 250);

function checkUser() {
    if (localStorage.getItem('user')) {
        window.location.pathname = '/dashboard'
    } 
}