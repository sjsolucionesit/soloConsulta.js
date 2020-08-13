const btnLlamar = document.getElementById('btnLlamar');
const paciente = document.getElementById('paciente');
const reloj = document.getElementById('reloj');
const leyendCAll = document.getElementById('leyendCAll');

const contenedorPrincipal = document.getElementById('contenedorPrincipal');
const renderFecha = document.getElementById('renderFecha');
const renderFichaPaciente = document.getElementById('renderFichaPaciente');
const finishConsulta = document.getElementById('finishConsulta');
const formularFirmar = document.getElementById('formularFirmar');
const diagDatosBas2 = document.getElementById('diagDatosBas2');
const formulaMedica1 = document.getElementById('formulaMedicaInput');
const renderMotivo = document.getElementById('renderMotivo');
const desDiagnostica = document.getElementById('desDiagnostica');
const renderAlergias = document.getElementById('renderAlergias');
const paraDes = document.getElementById('paraDes');
const btnFormula = document.getElementById('btnFormula');
const descargarHc = document.getElementById('descargarHc');
const descargarFormula = document.getElementById('descargarFormula');
const descargarOrden = document.getElementById('descargarOrden');
const contenedorFormulasMedicas = document.getElementById('contenedorFormulasMedicas');
const renderOrdenes = document.getElementById('renderOrdenes');

let dataParaPdf = {};
let datosPacForRender = '';
let datosIdCall = '';


llamarMedicamentos();

async function llamarMedicamentos(){
    let listMedicamentos = '';
    const peticionMedicamentos = await fetch('/medicamentosList');
    const respuestaMedicamentos = await peticionMedicamentos.json();
    respuestaMedicamentos.forEach(medicamento => {
        listMedicamentos += `<option value="${medicamento.descripcion.split(';')[0]}"></option>`;
    });
    const listaParaImprimir = `
    <datalist id="medicamentoLista">
        ${listMedicamentos}
    </datalist>`;
    document.getElementById('listaParaImprimirMedicamentos').innerHTML = listaParaImprimir;
}


async function llamarMedicamentos2(){
    let listMedicamentos = '';
    const peticionMedicamentos = await fetch('/farmacos');
    const respuestaMedicamentos = await peticionMedicamentos.json();
    respuestaMedicamentos.forEach(medicamento => {
        listMedicamentos += `<option value="${medicamento.descripcion}"></option>`;
    });
    const listaParaImprimir = `
    <datalist id="farmacosLista">
        ${listMedicamentos}
    </datalist>`;
    document.getElementById('listaParaImprimirFarmacos').innerHTML = listaParaImprimir;
}

async function llamarMedicamentos3(){
    let listMedicamentos = '';
    const peticionMedicamentos = await fetch('/cups');
    const respuestaMedicamentos = await peticionMedicamentos.json();
    respuestaMedicamentos.forEach(medicamento => {
        listMedicamentos += `<option value="${medicamento.codigo} ${medicamento.descripcion}"></option>`;
    });
    const listaParaImprimir = `
    <datalist id="cupsList">
        ${listMedicamentos}
    </datalist>`;
    document.getElementById('listaParaImprimirCups').innerHTML = listaParaImprimir;
}

renderDatosConsulta();
llamarMedicamentos2();
llamarMedicamentos3()

btnLlamar.disabled = true;
btnFormula.disabled = true;

const cie10Input = document.getElementById('cie10Input');
const wanted = document.getElementById('wanted');
const recommended = document.getElementById('recommended');
const firmar = document.getElementById('firmar');

const textArea1 = document.getElementById('textArea1');

const contenidoFormula = document.getElementById('contenidoFormula');

formularFirmar.disabled = true;
firmar.disabled = true;
btnFormula.disabled = true;

window.addEventListener('load', async() => {
    let listMedicamentos = '';
    const peticionMedicamentos = await fetch('/cie10');
    const respuestaMedicamentos = await peticionMedicamentos.json();
    respuestaMedicamentos.forEach(medicamento => {
        listMedicamentos += `<option value="${medicamento.codigo} ${medicamento.descripcion}"></option>`;
    });
    const listaParaImprimir = `
    <datalist id="cie10List">
        ${listMedicamentos}
    </datalist>`;
    document.getElementById('listaParaImprimirCie10').innerHTML = listaParaImprimir;
});

cie10Input.addEventListener('input', async() => {
    if (cie10Input.value.length > 0) {
        confirmFormula();
    }
});

textArea1.addEventListener('input', () => {
    if (textArea1.value.length > 0) {
        firmar.disabled = false;
        btnFormula.disabled = false;
    } else {
        firmar.disabled = true;
        btnFormula.disabled = true;

    }
});

firmar.addEventListener('click', async() => {
    const decision = confirm('Estas seguro que deseas finalizar la consulta, no podrás modificar ningún documento después de aceptar.');
    if (decision) {
        const peticion = await fetch('/terminar-consulta', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataParaPdf)
        })
        const respuesta = await peticion.json();
        if (respuesta.ok = 'ok') {
            contenedorPrincipal.innerHTML = `<div class="w-75 p-4">
                                                <small>Consulta finalizada con éxito</small>
                                            </div>`
        }
    }
});

wanted.addEventListener('input', () => {
    confirmFormula();
});

recommended.addEventListener('input', () => {
    confirmFormula();
});

function confirmFormula() {
    if (wanted.value.length > 0 && recommended.value.length > 0 && desDiagnostica.value.length > 0) {
        formularFirmar.disabled = false;
    } else {
        formularFirmar.disabled = true;
    }
}


formularFirmar.addEventListener('click', () => {
    
    const diag = document.getElementById('diag');
    const diagDatosBas = document.getElementById('diagDatosBas');
    let ocupacionDataDescripcion = '';
    if (typeof datosPacForRender.ocupacionData != 'undefined') {
        ocupacionDataDescripcion = datosPacForRender.ocupacionData.descripcion;
    }
    diagDatosBas.innerHTML = `
                        <div style="width: 100%; margin: 5px auto; position: relative; font-size: .6em;">
                            <img src="./img/logo.png" width="100px" style="position: absolute; top: 0px; left: 0px;">
                            <br>
                            <br>
                            <br>
                            <br>
                            <h3 style="width: 100%; text-align: center; font-size: 1.3em;">Historia Videoconsulta</h3>
                            <br>
                            <table style="width: 100%; border: none !important;">
                                <tr style="width: 40%; border: none !important;">
                                    <th style="width: 20%; border: none !important;">No. Historia video consulta</th>
                                    <th style="font-weight: 400; border: none !important;">${datosPacForRender.cedula}</th>
                                    <th style="width: 30%; border: none !important;"></th>
                                    <th style="font-weight: 400; border: none !important;"><strong>Fecha: </strong>${new Date().getDate()}-${new Date().getMonth()}-${new Date().getFullYear()}</th>
                                </tr>
                            </table>
                            <br>
                            <h3 style="width: 100%; text-align: center; font-size: 1.2em;">Identificación de paciente</h3>
                            <br>
                            <table style="width: 100%;">
                                <tr>
                                    <th style="width: 20%;">Paciente</th>
                                    <th style="font-weight: 400;">${datosPacForRender.nombre} ${datosPacForRender.apellido}</th>
                                    <th style="width: 20%">No. Documento.</th>
                                    <th style="font-weight: 400;">${datosPacForRender.tipoDoc} ${datosPacForRender.cedula}</th>
                                </tr>
                                <tr>
                                    <th>Lugar Nacimiento</th>
                                    <th style="font-weight: 400;">${datosPacForRender.lugarNacimiento}</th>
                                    <th>Fecha Nacimiento</th>
                                    <th style="font-weight: 400;">${datosPacForRender.fechaNacimiento.split('T')[0]}</th>
                                </tr>
                                <tr>
                                    <th>Ocupación</th>
                                    <th style="font-weight: 400;">${ocupacionDataDescripcion}</th>
                                    <th>Genero</th>
                                    <th style="font-weight: 400;">${datosPacForRender.genero}</th>
                                </tr>
                                <tr>
                                    <th>Pais</th>
                                    <th style="font-weight: 400;">${datosPacForRender.pais}</th>
                                    <th>Ciudad</th>
                                    <th style="font-weight: 400;">${datosPacForRender.ciudad}</th>
                                </tr>
                                <tr>
                                    <th>Dirección</th>
                                    <th style="font-weight: 400;">${datosPacForRender.direccion}</th>
                                    <th>Teléfono</th>
                                    <th style="font-weight: 400;">${datosPacForRender.telefono}</th>
                                </tr>
                                <tr style="width: 100%;">
                                    <th>Tutor Legal: </th>
                                    <th style="font-weight: 400;">${datosPacForRender.nombreTutor}</th>
                                    <th>No. Documento:</th>
                                    <th style="font-weight: 400;">${datosPacForRender.cedulaTutor}</th>
                                </tr>
                                <tr style="width: 100%;">
                                    <th>Empresa</th>
                                    <th style="font-weight: 400; width: 25%;">${typeof datosPacForRender.saludData != 'undefined' ? datosPacForRender.saludData.servicio : 'No registra'}</th>
                                    <th>No. Autorización</th>
                                    <th style="font-weight: 400; width: 25%;">${datosPacForRender.autorizacion}</th>
                                </tr>
                                <tr style="width: 100%;">
                                    <th>Tipo usuario</th>
                                    <th style="font-weight: 400; width: 25%;">${datosPacForRender.tipoUser}</th>
                                    <th>Tipo afiliación</th>
                                    <th style="font-weight: 400; width: 25%;">${datosPacForRender.afiliacion}</th>
                                </tr>
                            </table>
                            `;
    diagDatosBas2.innerHTML = `
    <div style="font-size: .6em;">
    <img src="./img/logo.png" width="100px" style="position: absolute; top: 0px; left: 0px;">
                            <br>
                            <br>
                            <br>
                            <br>
                            <h3 style="width: 100%; text-align: center; font-size: 1.3em;">Formula Medica</h3>
                            <br>
                            <table style="width: 100%; border: none !important;">
                                <tr style="width: 40%; border: none !important;">
                                    <th style="width: 20%; border: none !important;">No. Formula Videoconsulta</th>
                                    <th style="font-weight: 400; border: none !important;">${datosPacForRender.cedula}</th>
                                    <th style="width: 30%; border: none !important;"></th>
                                    <th style="font-weight: 400; border: none !important;"><strong>Fecha: </strong>${new Date().getDate()}-${new Date().getMonth()}-${new Date().getFullYear()}</th>
                                </tr>
                            </table>
    <br>
    <table style="width: 100%;">
        <tr>
            <th>Paciente</th>
            <th style="font-weight: 400;">${datosPacForRender.nombre} ${datosPacForRender.apellido}</th>
            <th>No. Documento.</th>
            <th style="font-weight: 400;">${datosPacForRender.tipoDoc} ${datosPacForRender.cedula}</th>
        </tr>
        <tr>
            <th>Lugar Nacimiento</th>
            <th style="font-weight: 400;">${datosPacForRender.lugarNacimiento}</th>
            <th>Fecha Nacimiento</th>
            <th style="font-weight: 400;">${datosPacForRender.fechaNacimiento}</th>
        </tr>
        <tr>
            <th>Ocupación</th>
            <th style="font-weight: 400;">${ocupacionDataDescripcion}</th>
            <th>Genero</th>
            <th style="font-weight: 400;">${datosPacForRender.genero}</th>
        </tr>
        <tr>
            <th>Pais</th>
            <th style="font-weight: 400;">${datosPacForRender.pais}</th>
            <th>Ciudad</th>
            <th style="font-weight: 400;">${datosPacForRender.ciudad}</th>
        </tr>
        <tr>
            <th>Dirección</th>
            <th style="font-weight: 400;">${datosPacForRender.direccion}</th>
            <th>Teléfono</th>
            <th style="font-weight: 400;">${datosPacForRender.telefono}</th>
        </tr>
        <tr style="width: 100%;">
            <th>Tutor Legal: </th>
            <th style="font-weight: 400;">${datosPacForRender.nombreTutor}</th>
            <th>No. Documento:</th>
            <th style="font-weight: 400;">${datosPacForRender.cedulaTutor}</th>
        </tr>
        <tr style="width: 100%;">
            <th>Empresa</th>
            <th style="font-weight: 400; width: 25%;">${typeof datosPacForRender.saludData != 'undefined' ? datosPacForRender.saludData.servicio : 'No registra'}</th>
            <th>No. Autorización</th>
            <th style="font-weight: 400; width: 25%;">${datosPacForRender.autorizacion}</th>
        </tr>
        <tr style="width: 100%;">
            <th>Tipo usuario</th>
            <th style="font-weight: 400; width: 25%;">${datosPacForRender.tipoUser}</th>
            <th>Tipo afiliación</th>
            <th style="font-weight: 400; width: 25%;">${datosPacForRender.afiliacion}</th>
        </tr>
    </table>
    </div>
                            `;
    renderOrdenes.innerHTML = `
                            <div style="font-size: .6em;">
                            <img src="./img/logo.png" width="100px" style="position: absolute; top: 0px; left: 0px;">
                                                    <br>
                                                    <br>
                                                    <br>
                                                    <br>
                                                    <h3 style="width: 100%; text-align: center; font-size: 1.3em;">Ordenes</h3>
                                                    <br>
                                                    <table style="width: 100%; border: none !important;">
                                                        <tr style="width: 40%; border: none !important;">
                                                            <th style="width: 20%; border: none !important;">No. Orden Videoconsulta</th>
                                                            <th style="font-weight: 400; border: none !important;">${datosPacForRender.cedula}</th>
                                                            <th style="width: 30%; border: none !important;"></th>
                                                            <th style="font-weight: 400; border: none !important;"><strong>Fecha: </strong>${new Date().getDate()}-${new Date().getMonth()}-${new Date().getFullYear()}</th>
                                                        </tr>
                                                    </table>
                            <br>
                            <table style="width: 100%;">
                                <tr>
                                    <th>Paciente</th>
                                    <th style="font-weight: 400;">${datosPacForRender.nombre} ${datosPacForRender.apellido}</th>
                                    <th>No. Documento.</th>
                                    <th style="font-weight: 400;">${datosPacForRender.tipoDoc} ${datosPacForRender.cedula}</th>
                                </tr>
                                <tr>
                                    <th>Lugar Nacimiento</th>
                                    <th style="font-weight: 400;">${datosPacForRender.lugarNacimiento}</th>
                                    <th>Fecha Nacimiento</th>
                                    <th style="font-weight: 400;">${datosPacForRender.fechaNacimiento}</th>
                                </tr>
                                <tr>
                                    <th>Ocupación</th>
                                    <th style="font-weight: 400;">${ocupacionDataDescripcion}</th>
                                    <th>Genero</th>
                                    <th style="font-weight: 400;">${datosPacForRender.genero}</th>
                                </tr>
                                <tr>
                                    <th>Pais</th>
                                    <th style="font-weight: 400;">${datosPacForRender.pais}</th>
                                    <th>Ciudad</th>
                                    <th style="font-weight: 400;">${datosPacForRender.ciudad}</th>
                                </tr>
                                <tr>
                                    <th>Dirección</th>
                                    <th style="font-weight: 400;">${datosPacForRender.direccion}</th>
                                    <th>Teléfono</th>
                                    <th style="font-weight: 400;">${datosPacForRender.telefono}</th>
                                </tr>
                                <tr style="width: 100%;">
                                    <th>Tutor Legal: </th>
                                    <th style="font-weight: 400;">${datosPacForRender.nombreTutor}</th>
                                    <th>No. Documento:</th>
                                    <th style="font-weight: 400;">${datosPacForRender.cedulaTutor}</th>
                                </tr>
                                <tr style="width: 100%;">
                                    <th>Empresa</th>
                                    <th style="font-weight: 400; width: 25%;">${typeof datosPacForRender.saludData != 'undefined' ? datosPacForRender.saludData.servicio : 'No registra'}</th>
                                    <th>No. Autorización</th>
                                    <th style="font-weight: 400; width: 25%;">${datosPacForRender.autorizacion}</th>
                                </tr>
                                <tr style="width: 100%;">
                                    <th>Tipo usuario</th>
                                    <th style="font-weight: 400; width: 25%;">${datosPacForRender.tipoUser}</th>
                                    <th>Tipo afiliación</th>
                                    <th style="font-weight: 400; width: 25%;">${datosPacForRender.afiliacion}</th>
                                </tr>
                            </table>
                            </div>
                            <br>
                            <div class="w-100">
                                <div class="row mb-2">
                                    <div class="col-6">
                                        <label for="medicamento">Procedimiento</label>
                                        <input list="cupsList" id="formulaMedicaInput" class="form-control medicacion2"/>
                                    </div>
                                    <div class="col-2">
                                        <label for="medicamento">Cantidad</label>
                                        <input type="number" min="1" step="1" class="form-control medicacion2">
                                    </div>
                                    <div class="col-4">
                                        <label for="medicamento">Lateralidad</label>
                                        <select class="form-control medicacion2">
                                            <option value="NA">No aplica</option>
                                            <option value="Ambos">Ambos</option>
                                            <option value="Izquierdo">Izquierdo</option>
                                            <option value="Derecho">Derecho</option>
                                        </select>
                                    </div>
                                    <div class="col-12">
                                        <label for="">Descripción</label>
                                        <textarea name="" class="form-control medicacion2" id="" cols="30" rows="3"></textarea>
                                    </div>
                                </div>
                                <div id="contenedorFormulasMedicas2" class="w-100">
                                </div>
                                <div class="w-100 d-flex justify-content-end my-2">
                                    <div class="col d-flex justify-content-end">
                                        <button onclick="adicionarElementoFormula2()" class="btn btn-main">Adicionar</button>
                                    </div>
                                </div>
                            </div>
                                                    `;
    diag.innerHTML = `
                    <h4 style="width: 100%; text-align: center; margin: 10px auto; font-size: .7em;">Anamnesis</h4>
                        <table style="width: 100%; font-size: .7em;">
                            <tr>
                                <th style="width: 20%;">Motivo consulta</th>
                                <th style="font-weight: 400;">${datosPacForRender.motivo}</th>
                            </tr>
                            <tr>
                                <th>Enfermedad actual</th>
                                <th style="font-weight: 400;">${textArea1.value}</th>
                            </tr>
                        </table>
                        <br>
                        <table style="width: 100%; font-size: .7em;">
                            <tr>
                                <th style="text-align: letf;">Antecedentes alergicos</th>
                            </tr>
                            <tr style="height: 20px; vertical-align: top;">        
                                <th style="font-weight: 400;">${document.getElementById('renderAlergias').value}</th>
                            </tr>
                        </table>
                        <table style="width: 100%; font-size: .7em; margin-top: 5px;">
                            <tr>
                                <th style="text-align: left;">Antecedentes (Farmacológicos, Quirúrgicos, Familiares, Otros)</th>
                            </tr>
                            <tr style="height: 20px; vertical-align: top;">        
                                <th style="font-weight: 400;">${document.getElementById('renderAntecedentes').value}</th>
                            </tr>
                        </table>
                        <br>
                        <table style="width: 100%; font-size: .7em;">
                            <tr>
                                <th style="text-align: center;">Hallazgos</th>
                            </tr>
                            <tr style="height: 100px; vertical-align: top;">        
                                <th style="font-weight: 400;">${wanted.value}</th>
                            </tr>
                        </table>
                        <br>
                        <table style="width: 100%; font-size: .7em;">
                            <tr>
                                <th style="width: 23%; vertical-align: top;">Evaluación paraclinicos:</th>
                                <th style="font-weight: 400; height: 80px; vertical-align: top;">${paraDes.value}</th>
                            </tr>
                        </table>
                        <br>
                        <table style="width: 100%; font-size: .7em;">
                            <tr>
                                <th style="width: 23%; vertical-align: top; vertical-align: top;">Diagnostico Cie10</th>
                                <th style="font-weight: 400; height: 40px; vertical-align: top;">${cie10Input.value}</th>
                            </tr>
                            <tr>
                                <th style="width: 23%; vertical-align: top;">Diagnostico clínico</th>
                                <th style="font-weight: 400; height: 50px; vertical-align: top;">${desDiagnostica.value}</th>
                            </tr>
                        </table>
                        <br>
                        <table style="width: 100%; font-size: .7em;">
                            <tr>
                                <th style="width: 23%; vertical-align: top; text-align: center;">Recomendación y plan:</th>
                            </tr>
                            <tr style="width: 100%;">
                                <th style="font-weight: 400; height: 70px; vertical-align: top;">${recommended.value}</th>
                            </tr>
                        </table>
                        <br>
                        <br>
                        <table style="font-size: .7em;">
                            <tr>
                                <th>${datosPacForRender.doc.nombre} ${datosPacForRender.doc.apellido}</th>
                            </tr>
                            <tr>
                                <th>Numero Prof.</th>
                                <th style="font-weight: 400;">${datosPacForRender.doc.numeroCarne}</th>
                            </tr>
                            <tr>
                                <th>Especialización:</th>
                                <th style="font-weight: 400;">${datosPacForRender.doc.especialidad}</th>
                            </tr>
                        </table>
                    </div> `;
    dataParaPdf.alergias = document.getElementById('renderAlergias').value;
    dataParaPdf = datosPacForRender;
    dataParaPdf.antecedentes = document.getElementById('renderAntecedentes').value;
    dataParaPdf.enfermedad = textArea1.value;
    dataParaPdf.hallazgos = wanted.value;
    dataParaPdf.paraclinicos = paraDes.value;
    dataParaPdf.cie10 = cie10Input.value;
    dataParaPdf.disagnostico = desDiagnostica.value;
    dataParaPdf.plan = recommended.value;
});

async function GuardarPdf() {
    document.getElementById('loadPdfHcSim').innerText = 'Generando HC...';
    const requestGeneratePdfHc = await fetch('/generate-pdf-hc', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataParaPdf)
    });
    const responsePdfHC = await requestGeneratePdfHc.json();
    if (JSON.stringify(responsePdfHC) != '{}') {
        console.log('ok');
        btnFormula.disabled = false;
        $('#generarHCModal').modal('hide');
        descargarHc.classList.remove('d-none');
        descargarHc.classList.add('d-flex');
        descargarHc.download = `hc-${dataParaPdf.nombre}-${dataParaPdf.apellido}.pdf`;
        descargarHc.href = `/descargar/hc/${dataParaPdf.id}`;
        firmar.disabled = false;
        document.getElementById('loadPdfHcSim').innerText = 'Guardar';
    }
}

async function GuardarFormula() {

   const casillasMedicamentos = document.querySelectorAll('.medicacion');

    let formula = [];
    
    casillasMedicamentos.forEach( valor => {
            formula.push(valor.value);
    });
   
    datosPacForRender.formulaNueva = formula;

    const requestGeneratePdfHc = await fetch('/generate-pdf-formula', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosPacForRender)
    });

    const responsePdfHC = await requestGeneratePdfHc.json();

    if (JSON.stringify(responsePdfHC) != '{}') {
        console.log('ok');
        btnFormula.disabled = false;
        $('#formularDiv').modal('hide');
        descargarFormula.classList.remove('d-none');
        descargarFormula.classList.add('d-flex');
        descargarFormula.download = `formula-${dataParaPdf.nombre}-${dataParaPdf.apellido}.pdf`;
        descargarFormula.href = `/descargar/formula/${dataParaPdf.id}`;
        firmar.disabled = false;
    }
}

async function GuardarFormula2() {

   let ordenes = []
   const casillasMedicamentos = document.querySelectorAll('.medicacion2');
   casillasMedicamentos.forEach( valor => {
       ordenes.push(valor.value);
   });
   datosPacForRender.ordenNueva = ordenes;
   const requestGeneratePdfHc = await fetch('/generate-pdf-ordenes', {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(dataParaPdf)
});
const responsePdfHC = await requestGeneratePdfHc.json();
    if (JSON.stringify(responsePdfHC) != '{}') {
        console.log('ok');
        btnFormula.disabled = false;
        $('#ordenesDiv').modal('hide');
        descargarOrden.classList.remove('d-none');
        descargarOrden.classList.add('d-flex');
        descargarOrden.download = `ordenes-${dataParaPdf.nombre}-${dataParaPdf.apellido}.pdf`;
        descargarOrden.href = `/descargar/ordenes/${dataParaPdf.id}`;
        firmar.disabled = false;
    }
}

async function renderDatosConsulta() {
    const datosLlamada = await fetch('/AquienLlamo');
    const dataCal = await datosLlamada.json();
    document.getElementById('renderAntecedentes').value = dataCal.antecede;
    if (JSON.stringify(dataCal) != '{}') {
        renderFecha.innerHTML = `
                            <div class="w-100 justify-content-between d-flex">
                                <small>Fecha Consulta</small>
                                <small class="datosPdf"> ${dataCal.fechaConsulta.split('T')[0]}</small>
                            </div>
                            <div class="w-100 justify-content-between d-flex">
                                <small>Hora Consulta</small>
                                <small class="datosPdf"> ${dataCal.horaConsulta.split(':')[0] + ':' + dataCal.horaConsulta.split(':')[1]}</small>
                            </div>
                        `;
        const date = new Date().getFullYear();
        const fechaNac = dataCal.fechaNacimiento.split('T')[0].split('-')[0];
        const edad = date - fechaNac;
        datosPacForRender = dataCal;
        datosPacForRender.edad = edad;
        let ocupac = '';
        let datoSalud = '';
        if (typeof dataCal.saludData == 'undefined') {
            datoSalud = '';
        } else {
            datoSalud = dataCal.saludData.tipoSalud.toLowerCase() + ' ' + dataCal.saludData.servicio.toLowerCase();
        }
        if (typeof dataCal.ocupacionData == 'undefined') {
            ocupac = '';
        } else {
            ocupac = dataCal.ocupacionData.descripcion
        }
        renderFichaPaciente.innerHTML = `
                            <div class="w-75 d-flex justify-content-start align-items-start flex-column">

                                <div class="w-75 d-flex justify-content-between align-items-center">
                                    <div class="w-50">
                                        <small>${dataCal.nombre} ${dataCal.apellido}</small>
                                    </div>
                                    <div class="w-50">
                                        <small>${edad} Años</small>
                                    </div>
                                </div>

                                <div class="w-75 d-flex flex-wrap justify-content-between align-items-center" style="margin-top: -5px;">
                                        <div class="w-50">
                                            <small>${dataCal.tipoDoc} ${dataCal.cedula}</small>
                                        </div>
                                        <div class="w-50">
                                            <small>Hemoclasificación: ${dataCal.rh}</small>
                                        </div>
                                </div>

                                <div class="w-75 d-flex justify-content-between align-items-start" style="margin-top: -5px;">
                                        <div class="w-50">
                                            <small>${dataCal.genero}</small>
                                        </div>
                                        <div class="w-50">
                                            <small>${ocupac}</small>
                                        </div>
                                </div>
                                <small>${datoSalud}</small>

                            </div>
                            <img src="${dataCal.rutaImg}" width="80px" height="80px" class="rounded-circle" alt="img paciente">
                            `;

        renderAlergias.value = dataCal.alergias.slice(0, -1);
        renderMotivo.value = dataCal.motivo;
        datosIdCall = dataCal.email;
        const fecha = dataCal.fechaConsulta.split('T')[0];
        const hora = dataCal.horaConsulta;
        const dateActual = new Date();
        const dateInput = new Date(fecha + 'T' + hora);
        if (dateInput.getTime() - 300000 < dateActual.getTime() && dateActual.getTime() < dateInput.getTime() + 600000) {
            btnLlamar.disabled = false;
        } else {
            btnLlamar.disabled = true;
        }
        if (dateInput.getTime() + 1500000 < dateActual.getTime()) {
            await fetch(`/consultaNoValida/${dataCal.id}`);
            location.reload();
        }
        setInterval(async() => {
            const fecha = dataCal.fechaConsulta.split('T')[0];
            const hora = dataCal.horaConsulta;
            const dateActual = moment(new Date());
            const dateInput = moment(new Date(fecha + 'T' + hora));
            if (dateInput.getTime() - 300000 < dateActual.getTime() && dateActual.getTime() < dateInput.getTime() + 600000) {
                btnLlamar.disabled = false;
            } else {
                btnLlamar.disabled = true;
            }
            if (dateInput.getTime() + 1500000 < dateActual.getTime()) {
                await fetch(`/consultaNoValida/${dataCal.id}`);
            }
        }, 60000)
    } else {
        contenedorPrincipal.innerHTML = `<div class="w-75 p-4">
        <small>Aun no tienes citas agendas</small>
        </div>`
    }
}

btnLlamar.addEventListener('click', async() => {
    paciente.classList.remove('d-none');
    btnLlamar.classList.add('d-none');
    leyendCAll.classList.add('d-none');
    console.log(datosIdCall);
    call(datosIdCall);
    iniciarReloj();
})

async function call(emailPacLlamar) {
    const datosLlamada = {
        paciente: emailPacLlamar
    }

    const call = await fetch('/llamar', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosLlamada)
    });

    const respuesta = await call.json();
    initializeSession(respuesta.api, respuesta.sesion_id, respuesta.token);
    console.table(respuesta);
}

function initializeSession(apiKey, sessionId, token) {
    var session = OT.initSession(apiKey, sessionId);

    session.on('streamCreated', function streamCreated(event) {
        var subscriberOptions = {
            insertMode: 'append',
            width: '100%',
            height: '100%'
        };
        session.subscribe(event.stream, 'paciente', subscriberOptions, handleError);
    });
    const leyendEspera = document.getElementById('leyendEspera');
    leyendEspera.classList.remove('d-none');
    session.on('sessionDisconnected', function sessionDisconnected(event) {
        console.log('You were disconnected from the session.', event.reason);
    });

    // initialize the publisher
    var publisherOptions = {
        insertMode: 'append',
        width: '100%',
        height: '100%'
    };
    var publisher = OT.initPublisher('medico', publisherOptions, handleError);

    // Connect to the session
    session.connect(token, function callback(error) {
        if (error) {
            handleError(error);
        } else {
            // If the connection is successful, publish the publisher to the session
            session.publish(publisher, handleError);
        }
    });

    finishConsulta.addEventListener('click', async() => {
        const decision = confirm('Finalizar la consulta, cerrara la comunicación con tu paciente de forma permanente');
        if (decision) {
            session.disconnect();
            paciente.classList.add('d-none');
            const datosFinish = {
                id_consulta: datosPacForRender.id
            }
            const finish = await fetch('/finalizar-llamada', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datosFinish)
            });
        }
    });
}

function handleError(error) {
    if (error) {
        alert(error.message);
    }
}

function iniciarReloj() {
    let minutos = 24;
    let segundos = 59;
    setInterval(() => {
        if (minutos != 0 || segundos != 1) {
            if (segundos == 0) {
                segundos = 60;
                minutos--;
            }
            if (minutos <= 9 && segundos <= 9) {
                reloj.innerText = '0' + minutos + ':0' + segundos;
            } else {
                if (minutos <= 9 && segundos > 9) {
                    reloj.innerText = '0' + minutos + ':' + segundos;
                } else {
                    if (minutos > 9 && segundos <= 9) {
                        reloj.innerText = minutos + ':0' + segundos;
                    } else {
                        reloj.innerText = minutos + ':' + segundos;
                    }
                }
            }
            segundos--;
        } else {
            reloj.innerText = '00:00';
            reloj.classList.add('text-danger');
        }
    }, 1000);
}

function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false; }
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
            /*check if the item starts with the same letters as the text field value:*/
            if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                /*create a DIV element for each matching element:*/
                b = document.createElement("DIV");
                /*make the matching letters bold:*/
                b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].substr(val.length);
                /*insert a input field that will hold the current array item's value:*/
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function(e) {
                    /*insert the value for the autocomplete text field:*/
                    inp.value = this.getElementsByTagName("input")[0].value;
                    /*close the list of autocompleted values,
                    (or any other open lists of autocompleted values:*/
                    closeAllLists();
                });
                a.appendChild(b);
            }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
            }
        }
    });

    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
    }

    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }

    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
}

function getDataForHc() {
    const motivo = document.getElementById('motivoHc').innerText;
    const nombre = document.getElementById('nombreCompletoHc').innerText;
    const cedula = document.getElementById('cedulaHc').innerText;
    const edad = document.getElementById('edadHc').innerText;
    const telefono = document.getElementById('telefonoHc').innerText;
    const email = document.getElementById('emailHc').innerText;
    const tipoSanguineo = document.getElementById('rhHC').innerText;
    const enfermedadActual = document.getElementById('enfermedadActual').innerText;
    const diagnostico = document.getElementById('diagnostico').innerText;
    const recomendacion = document.getElementById('recomendacionHC').innerText;
    const paraclinicos = document.getElementById('textArea1').value;
    const formulaMedicaInput = document.getElementById('formulaMedicaInput').value;
    const hallazgos = wanted.value;

    const jsonData = {
        motivo,
        nombre,
        genero: datosPacForRender.genero,
        cedula,
        edad,
        telefono,
        email,
        tipoSanguineo,
        enfermedadActual,
        diagnostico,
        recomendacion,
        hallazgos,
        paraclinicos,
        descripcionDiag: desDiagnostica.value,
        id_consulta: datosPacForRender.id,
        salud: datosPacForRender.saludData,
        ocupacionInfo: typeof datosPacForRender.ocupacionData != 'undefined' ? datosPacForRender.ocupacionDat : 'No registra',
        alergicos: datosPacForRender.alergias,
        formula: formulaMedicaInput
    }

    return jsonData;
}

async function abrirFormula() {
    $('#formularDiv').modal('show');
    $('#generarHCModal').modal('hide');
}

function adicionarElementoFormula(){
    const elementMedicamento = document.createElement('div');
    elementMedicamento.classList.add('row');
    elementMedicamento.classList.add('mb-2');
    elementMedicamento.innerHTML = `<div class="col-3">
                                        <label for="medicamento">Medicamento</label>
                                        <input list="medicamentoLista" class="form-control medicacion"/>
                                    </div>
                                    <div class="col-3">
                                        <label for="medicamento">Farmacéutica</label>
                                        <input type="text" class="form-control medicacion" list="farmacosLista">
                                    </div>
                                    <div class="col-2">
                                        <label for="medicamento">Cantidad</label>
                                        <input type="number" min="1" step="1" class="form-control medicacion">
                                    </div>
                                    <div class="col-4">
                                        <label for="medicamento">Presentación</label>
                                        <input type="text" class="form-control medicacion" list="farmacosLista">
                                    </div>
                                    <div class="col-12">
                                        <label for="">Descripción</label>
                                        <textarea name="" class="form-control medicacion" id="" cols="30" rows="3"></textarea>
                                    </div>`;
    contenedorFormulasMedicas.appendChild(elementMedicamento);
}


function adicionarElementoFormula2(){
    const elementMedicamento = document.createElement('div');
    const contenedorFormulasMedicas2 = document.getElementById('contenedorFormulasMedicas2');
    
  
    elementMedicamento.classList.add('row');
    elementMedicamento.classList.add('mb-2');
    elementMedicamento.innerHTML = `<div class="col-6">
                                        <label for="medicamento">Procedimiento</label>
                                        <input list="cupsList" class="form-control medicacion2"/>
                                    </div>
                                    <div class="col-2">
                                        <label for="medicamento">Cantidad</label>
                                        <input type="number" min="1" step="1" class="form-control medicacion2">
                                    </div>
                                    <div class="col-4">
                                        <label for="medicamento">Lateralidad</label>
                                        <select class="form-control medicacion2">
                                            <option value="Izquierdo">Izquierdo</option>
                                            <option value="Derecho">Derecho</option>
                                        </select>
                                    </div>
                                    <div class="col-12">
                                        <label for="">Descripción</label>
                                        <textarea name="" class="form-control medicacion2" id="" cols="30" rows="3"></textarea>
                                    </div>`;
    contenedorFormulasMedicas2.appendChild(elementMedicamento);
}