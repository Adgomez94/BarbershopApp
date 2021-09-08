let page = 1

const quotes ={
    name:'',
    date:'',
    hours:'',
    service:[]
}

document.addEventListener('DOMContentLoaded', () => {
    app()
})

const app = () => {
    consultDB()
    pagination()
    showSection()
    changeSection();
    pageNext()
    pagePrevious()
    showResumen()
    nameQuotes()
    dateQuotes()
    disabledDate()

}

const pagination = () => {
    const next = document.querySelector('#next')
    const previous = document.querySelector('#previous')
    const visible = document.querySelector('.visible')
    showResumen()

    if (visible) {
        hiddenSection(next, previous, visible)
        showSection()
    }

    if (page === 1) previous.classList.add('hidden')
    else if (page === 2) {
        previous.classList.remove('hidden')
        next.classList.remove('hidden')
        showResumen()
    } else if (page === 3){
        
        next.classList.add('hidden')
        
    } 

}

const pageNext = () => {
    const button = document.querySelector('#next')
    button.addEventListener('click', () => {
        page++
        pagination()
    })
}

const pagePrevious = () => {
    const button = document.querySelector('#previous')
    button.addEventListener('click', () => {
        page--
        pagination()
    })
}

const showSection = () => {
    //add
    document.querySelector(`[data-pass="${page}"]`).classList.add('current')
    const section = document.querySelector(`#pass-${page}`)
    section.classList.add('visible')
}

const hiddenSection = (next, previous, visible) => {
    next.classList.remove('current')
    previous.classList.remove('hidden')
    visible.classList.remove('visible')
    document.querySelector('.current').classList.remove('current')
}

const consultDB = async() => {
    try {
        const db = await fetch('../servicios.json');
        const resp = await db.json()
        const { servicios } = resp

        servicios.forEach(service => {
            createDOMService(service)
        });
    } catch (error) {
        console.log(error)
    }
}

const createDOMService = ({ id, nombre, precio }) => {
    const container = document.getElementById('services')
    const containerService = document.createElement('div')
    const nameService = document.createElement('P')
    const priceService = document.createElement('P')
        //name Service
    nameService.textContent = nombre
    nameService.classList.add('name-service')
        //Price service
    priceService.textContent = `$ ${precio}`
    priceService.classList.add('price-service')
    containerService.dataset.idService = id
    containerService.onclick = selectService
        //Container service
    containerService.classList.add('service')
    containerService.appendChild(nameService)
    containerService.appendChild(priceService)

    container.appendChild(containerService)
}

const selectService = (e) => {
    let element
    if (e.target.tagName === 'P') element = e.target.parentElement
    else element = e.target

    if (element.classList.contains('select')){
        element.classList.remove('select')
        removeService(parseInt(element.dataset.idService))
    } 
    else{
        element.classList.add('select')
        const serviceObj = {
            id: parseInt(element.dataset.idService),
            name: element.firstElementChild.textContent,
            price: element.lastElementChild.textContent  
        }
        addService(serviceObj)
    }
}

const changeSection = () => {

    const buttons = document.querySelectorAll('.tabs button')

    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault()
            page = parseInt(e.target.dataset.pass)
            pagination();
        })
    })
}

const showResumen = () =>{

    const { name, date, hours, service } = quotes;
    const resume = document.querySelector('.container-resume')

    let total = 0

    while(resume.firstChild){
        resume.removeChild(resume.firstChild)
    }

    if(Object.values(quotes).includes('')){
        
        const error = document.createElement('p');
        error.classList.add('invalid-quotes')
        error.textContent='Debe rellenar todos los campos'


        resume.appendChild(error)
    }else{
        const nameQuotes = document.createElement('p')
        nameQuotes.innerHTML = `<span>Nombre:</span>${name}`
        const dateQuotes = document.createElement('p')
        dateQuotes.innerHTML = `<span>Fecha:</span>${date}`
        const hoursQuotes = document.createElement('p')
        hoursQuotes.innerHTML = `<span>Hora:</span>${hours}`

        const serviceQuotes = document.createElement('div')
        serviceQuotes.classList.add('resumen-services')

        service.forEach(ser =>{
            const { name, price } = ser

            const containerDiv = document.createElement('div')
            containerDiv.classList.add('services')

            const textService = document.createElement('p')
            textService.textContent = name

            const priceService = document.createElement('p')
            priceService.textContent = price
            priceService.classList.add('price')

            const totalService = price.split('$')
            total += parseInt( totalService[1].trim() )

            containerDiv.appendChild(textService)
            containerDiv.appendChild(priceService)

            serviceQuotes.appendChild(containerDiv)
        })

        const headingService = document.createElement('h3')
        headingService.textContent = 'Resumen de Servicio'
        const headingQuotes = document.createElement('h3')
        headingQuotes.textContent = 'Resumen de Cita'

        resume.appendChild(headingQuotes)
        resume.appendChild(nameQuotes)
        resume.appendChild(dateQuotes)
        resume.appendChild(hoursQuotes)
        resume.appendChild(headingService)

        resume.appendChild(serviceQuotes)

        const totalService = document.createElement('p')
        totalService.innerHTML = `<span>Total a Pagar:</span> ${total}$`
        resume.appendChild(totalService)
    }
}

const addService = (serviceObj) =>{
    const { service } = quotes;

    quotes.service = [...service, serviceObj]

}

const removeService = (id) =>{
    const { service } = quotes;

    quotes.service = service.filter(serv => serv.id !== id)


}

const nameQuotes = () =>{
    const nameInput = document.getElementById('name')

    nameInput.addEventListener('input',(e)=>{
        const nameQuotes = e.target.value.trim()

        if(nameQuotes === '' || nameQuotes.length < 3) showAlert('Nombre no valido', 'error')
        else {
            const alertPrev = document.querySelector('.alert')
            if(alertPrev) alertPrev.remove()
            quotes.name = nameQuotes
        } 

        console.log(quotes)
    })
}

const showAlert = (messages, type) =>{

    const alertPrev = document.querySelector('.alert')

    if(alertPrev) return
    
    const alert = document.createElement('div')
    alert.classList.add('alert')
    alert.textContent = messages

    if( type === 'error' ){
        alert.classList.add('error')
    }

    const form = document.querySelector('.form')

    form.appendChild( alert )

    setTimeout(() => {
        alert.remove()
    }, 3000);
}

const dateQuotes = () =>{
    const dateInput = document.getElementById('date')
    const hourInput = document.getElementById('time')

    hourInput.addEventListener('input',(e)=>{
        quotes.hours = hourInput.value
    })
    
    dateInput.addEventListener('input',(e)=>{
        
        const date = new Date(e.target.value).getUTCDay()

        if( [0].includes( date ) ){
            // Para prevenir que no se ponga el dia
            e.preventDefault()
            showAlert('Fines de semanas no son Permitidos')
        }else{
            quotes.date = dateInput.value
        }

    })
}

const disabledDate = () =>{

    const dateInput = document.getElementById('date')

    const dateCurrent = new Date()

    const date = dateCurrent.getDate() + 1
    const month = dateCurrent.getMonth() + 1 
    const year = dateCurrent.getFullYear()
    
    dateInput.min = `${year}-${month}-${date}`
 
}