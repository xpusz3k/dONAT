const dashboard_boxes = document.querySelector('#dashboard_boxes').children

for (let i = 0; i < dashboard_boxes.length; i++) {
    const box = dashboard_boxes[i]

    box.addEventListener('click', () => toggleBox(i))
}

function toggleBox(box) {

    if (box == 0) {
        const orders_list = document.querySelector('.orders-list')

        orders_list.classList.toggle('show')

        const maintenance_list = document.querySelector('.maintenance-list')
        maintenance_list.classList.remove('show')
        const ads_list = document.querySelector('.ads-list')
        ads_list.classList.remove('show')
        
    } else if (box == 1) {
        const ads_list = document.querySelector('.ads-list')

        ads_list.classList.toggle('show')

        const orders_list = document.querySelector('.orders-list')
        orders_list.classList.remove('show')
        const maintenance_list = document.querySelector('.maintenance-list')
        maintenance_list.classList.remove('show')

    } else if (box == 2) {
        const maintenance_list = document.querySelector('.maintenance-list')

        maintenance_list.classList.toggle('show')

        const orders_list = document.querySelector('.orders-list')
        orders_list.classList.remove('show')
        const ads_list = document.querySelector('.ads-list')
        ads_list.classList.remove('show')
    }
} 

window.onload = loadOrdersList()

async function loadOrdersList() {
    try {
        const response = await fetch('/get-orders')
        const data = await response.json()

        const orders_list = document.querySelector('.orders-list')

        for (const order in data) {
            const box = document.createElement('div')

            box.classList.add('order')
            box.innerHTML = `
            <div class="left">
                    <i class="fas fa-sack-dollar"></i>
                </div>
                <div class="right">
                    <div class="nickname">
                        <span>${data[order].nickname}</span>
                    </div>
                    <div class="message">
                        <span>${data[order].message}</span>
                    </div>
                    <div class="value">
                        <span>${data[order].value}zł | ${data[order].donationType}</span>
                    </div>
                </div>
            `

            orders_list.appendChild(box)
        }
    } catch (error) {
        console.log(`🔥 An error occured with get Data from database, ${error}`);
    }
}

const maintenance_box = document.querySelector('.maintenance-box')

maintenance_box.addEventListener('click', () => toggleMaintenance())

async function toggleMaintenance() {
    await maintenance_box.classList.toggle('active')

    const isActive = maintenance_box.classList.contains("active");

    try {
        const response = await fetch("/toggle-maintenance", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ toggled: isActive })
        });

        const data = await response.json();
    } catch (error) {
        console.log(`🔥 An error occured with get Data from database, ${error}`);
    }
}

async function getMaintenanceStatus() {
    try {
        const response = await fetch("/get-maintenance-status", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();

        if (data && data.toggled) {
            maintenance_box.classList.add("active");
        }
    } catch (error) {
        console.log(`🔥 An error occured with get Data from database, ${error}`);
    }
}

window.onload = getMaintenanceStatus()


const textInput = document.querySelector('#textInput')
const imageInput = document.querySelector("#imageInput");

const adsForm = document.getElementById("ads-form");

adsForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    if (localStorage.getItem('user') == 'Dajsonekk') {
        newAd()
        return
    }

    try {
        const response = await fetch(`/check-banner-timeouts?user=${localStorage.getItem('user')}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();

        if (!data) {
            const requestData = {
                bannerCount: 1,
                user: localStorage.getItem('user')
            }
        
            try {
                const response = await fetch("/update-banner-timeouts", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(requestData)
                });
        
                const data = await response.json();
            } catch (error) {
                console.log(`🔥 An error occured with get Data from database, ${error}`);
            }

            newAd()
        } else {
            const requestData = {
                bannerCount: data.bannerCount += 1,
                user: localStorage.getItem('user')
            }
        
            try {
                const response = await fetch("/update-banner-timeouts", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(requestData)
                });
        
            } catch (error) {
                console.log(`🔥 An error occured with get Data from database, ${error}`);
            }
            if (data.bannerCount <= 2) {
                newAd()
            }
        }

    } catch (error) {
        console.log(`🔥 An error occured with get Data from database, ${error}`);
    }

    window.location.reload()
});

async function newAd() {
    const requestData = {
        text: textInput.value,
        image: imageInput.value,
        author: localStorage.getItem('user')
    }

    try {
        const response = await fetch("/save-ad", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestData)
        });

        const data = await response.json();
    } catch (error) {
        console.log(`🔥 An error occured with get Data from database, ${error}`);
    }

    window.location.reload()
}

const adsElement = document.querySelector('.ads')

async function loadImages() {
    try {
        const response = await fetch("/get-ads");
        const data = await response.json();

        for (const image in data) {
            const box = document.createElement('div')

            box.classList.add('ad')
            box.id = data[image].adID
            box.innerHTML = `<span>${data[image].text}</span> <button onclick="removeAd(${data[image].adID})"><i class="fas fa-trash"></i></button>`
            box.style.background = `url(${data[image].image})`;
            box.style.backgroundSize = 'cover'
            box.style.backgroundPosition = 'center'

            adsElement.appendChild(box)
        }
    } catch (error) {
        console.log(`🔥 An error occured with get Data from database, ${error}`);
    }
}

async function loadUserImages() {
    try {
        const response = await fetch("/get-ads");
        const data = await response.json();

        for (const image in data) {
            if (data[image].author == localStorage.getItem('user')) {
                const box = document.createElement('div')
    
                box.classList.add('ad')
                box.id = data[image].adID
                box.innerHTML = `<span>${data[image].text}</span> <button onclick="removeAd(${data[image].adID})"><i class="fas fa-trash"></i></button>`
                box.style.background = `url(${data[image].image})`;
                box.style.backgroundSize = 'cover'
                box.style.backgroundPosition = 'center'
    
                adsElement.appendChild(box)
            }

        }
    } catch (error) {
        console.log(`🔥 An error occured with get Data from database, ${error}`);
    }
}

async function removeAd(ID) {

    if (localStorage.getItem('user') == 'Dajsonekk') {
        removeAdvBox(ID)
        return
    }

    try {
        const response = await fetch(`/check-banner-cooldowns?user=${localStorage.getItem('user')}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();

        if (!data) {
            const days = 7 * 24 * 60 * 60 * 1000

            const requestData = {
                bannerTimeout: new Date().getTime() + days,
                user: localStorage.getItem('user')
            }
        
            try {
                const response = await fetch("/update-banner-cooldowns", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(requestData)
                });
        
                removeAdvBox(ID)
            } catch (error) {
                console.log(`🔥 An error occured with get Data from database, ${error}`);
            }
        } else {
            const days = 7 * 24 * 60 * 60 * 1000

            const current = new Date().getTime()

            if (current >= (data.bannerTimeout + days)) {
                removeAdvBox(ID)

                const requestData = {
                    bannerTimeout: new Date().getTime() + days,
                    user: localStorage.getItem('user')
                }
            
                try {
                    const response = await fetch("/update-banner-cooldowns", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(requestData)
                    });            
                } catch (error) {
                    console.log(`🔥 An error occured with get Data from database, ${error}`);
                }
            } else {
                console.log('CZAS!')
            }
        }
    } catch (error) {
        console.log(`🔥 An error occured with get Data from database, ${error}`);
    }
}

async function removeAdvBox(ID) {
    const requestData = {
        adID: ID
    }

    const box = document.getElementById(ID)
    box.remove()

    try {
        const response = await fetch("/remove-ad", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestData)
        });
    } catch (error) {
        console.log(`🔥 An error occured with get Data from database, ${error}`);
    }
}

window.onload = checkUser()

function checkUser() {
    if (!localStorage.getItem('user')) {
        window.location.pathname = '/'
    } else {
        if (localStorage.getItem('user') == 'Dajsonekk') {
            loadImages()
        } else {
            loadUserImages()
            const boxes = document.querySelector('#dashboard_boxes')
        
            boxes.children[0].classList.add('hide')
            boxes.children[2].classList.add('hide')
        }
    }
}