const container = document.querySelector('.container');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');

window.addEventListener('load',()=>{
    formulario.addEventListener('submit', buscarClima)
})



function buscarClima(e){
    e.preventDefault();

    //Validar 
    const ciudad = document.querySelector('#ciudad').value;
    const pais = document.querySelector('#pais').value;

    if(ciudad === '' || pais===''){
        mostrarError('Ambos campos son obligatorios');
        return;
    }
    //Consultamos la API
    consultarAPI(ciudad,pais);
}



function mostrarError(mensaje){
    const alerta = document.querySelector('.bg-red-100');
    if(!alerta){    
        //Crear alerta
        const alerta = document.createElement('DIV');
        alerta.classList.add('bg-red-100','border-red-400','text-red-700','px-4','py-3','rounded','max-w-md','mx-auto','mt-6','text-center');

        alerta.innerHTML=`
        <strong class="font-bold"> ERROR! </strong>
        <span class="block">${mensaje}</span>
        `;

        container.append(alerta);

        //Elimnar la alerta al tiempo
        setTimeout(() => {
            alerta.remove();
        }, 1500);
    }

}

function consultarAPI(ciudad,pais){

    const appId= 'e8caa4427e0367b0f3978e3c6d7e688a';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`;
  // Retraso de 1500 ms antes de mostrar el spinner
  Spinner(); // Muestra un Spinner de carga
    setTimeout(() => {
        fetch(url)
            .then(respuesta => respuesta.json())
            .then(datos => {
                limpiarHMLT(); // Limpiamos html antes de hacer el fetch
                console.log(datos);
                if (datos.cod === '404') {
                    mostrarError('Ciudad no encontrada');
                    return;
                }
                // Imprime la respuesta en el html
                mostrarCLima(datos);
            });
    }, 1500); // Retraso de 1500 ms
}


function mostrarCLima(datos){
    const {name, main: {temp, temp_max, temp_min}} = datos;
    //const {temp, temp_max , temp_min} =datos.main; también puedo hacerlo de esta forma
    const centigrados = kelvinACentigrados(temp);
    const max = kelvinACentigrados(temp_max);
    const min = kelvinACentigrados(temp_min);
    
    //Ciudad
    const nombreCiudad = document.createElement('p');
    nombreCiudad.textContent = `Clima en ${name}`;
    nombreCiudad.classList.add('font-bold', 'text-2xl');

    //Actual
    const actual = document.createElement('p');
    actual.innerHTML =`${centigrados} &#8451`;
    actual.classList.add('font-bold', 'text-6xl');

    //Maxima
    const tempMaxima = document.createElement('p');
    tempMaxima.innerHTML =`Max: ${max} &#8451`
    tempMaxima.classList.add('text-xl');

    //Minima
    const tempMinima = document.createElement('p');
    tempMinima.innerHTML =`Min: ${min} &#8451`
    tempMinima.classList.add('text-xl');

    //HTML
    const resultadoDiv = document.createElement('DIV');
    resultadoDiv.classList.add('text-center','text-white');
    resultadoDiv.appendChild(nombreCiudad);
    resultadoDiv.appendChild(actual);
    resultadoDiv.appendChild(tempMaxima);
    resultadoDiv.appendChild(tempMinima);
    resultado.appendChild(resultadoDiv);
}

const kelvinACentigrados = grados=> parseInt(grados -273.15); //arrow function helper 


function limpiarHMLT(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }
}

function Spinner(){
    limpiarHMLT();
    const divSpinner = document.createElement('DIV');
    divSpinner.classList.add('spinner');
    divSpinner.innerHTML = `
        <div class="spinner">
            <div class="double-bounce1"></div>
            <div class="double-bounce2"></div>
        </div>
    `;

    resultado.append(divSpinner);
}