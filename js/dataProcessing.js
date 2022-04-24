// Generacion de scanner
var html5QrcodeScanner = new Html5QrcodeScanner(
    "reader", { fps: 10, qrbox: 250 });

// Carga usuarios al cargar la pagina
var usersData = {};
window.onload = async function(){
  usersData = await getData();
  printUsers();
}

// fetch para traer los usuarios de la API
async function getData(){
    var parm = {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        }
    }
    const response = await fetch('http://localhost:3002/',parm);
    var data = await response.json();
    return data;
}

//  Al dar click generar un usuario al azar
document.getElementById("randomUser").addEventListener("click", function(e){
    const keys = Object.keys(usersData);
    let random = Math.floor(Math.random() * keys.length);
    Swal.fire(
        '¡Felicidades ' + usersData[random]["nombres"] + '!',
        'No ' + (random+1),
        'success'
      )
});

// Mostrar usuarios en la tabla
function printUsers(){
    let tbodyRef = document.getElementById('table-users').getElementsByTagName('tbody')[0];
    let cont = 1;
    Object.entries(usersData).map(item =>{
        let newRow = tbodyRef.insertRow(tbodyRef.rows.length);
        let column1 = newRow.insertCell(0);
        let column2 = newRow.insertCell(1);
        column1.innerHTML = cont;
        column2.innerHTML = item[1]["nombres"];
        cont ++;
    });
}

// Carga una vez detecte el codigo
function onScanSuccess(decodedText, decodedResult) {
    // Handle on success condition with the decoded text or result.
    console.log(`Scan result: ${decodedText}`, decodedResult);
    let data = decodedText.split("\n");
    if(data[0] !== "BEGIN:VCARD")
    {
        Swal.fire(
            'Este no es un codigo V-CARD',
            'Por favor intente nuevamente',
            'error'
          )
    }
    else{
       this.insertNewData(data);
    }
    // ...
   // html5QrcodeScanner.clear();
    // ^ this will stop the scanner (video feed) and clear the scan area.
}
html5QrcodeScanner.render(onScanSuccess);

// Insertar la nueva data en la base de datos a travez de la API
function insertNewData(data){
    var info = {
        "Nombre" : "N/A",
        "Movil" : 0,
        "Telefono": 0,
        "email" : "N/A",
        "Direccion" : "N/A",
        "Empresa" : "N/A",
        "web" : "N/A"
    };
    data.forEach(value => {
        let starts = value.split(":")[0];
        if (starts.startsWith("FN")){
            info["Nombre"] = value.split(":")[1];
        }

        if (starts.startsWith("TEL;HOME")){
            let number = value.split(":")[1];
            info["Telefono"] =  number.startsWith("+") ? number.substring(1): number;
        }

        if (starts.startsWith("TEL;CEL")){
            let number = value.split(":")[1];
            info["Movil"] =  number.startsWith("+") ? number.substring(1): number;
        }

        if (starts.startsWith("ORG")){
            info["Empresa"] =  value.split(":")[1];
        }

        if (starts.startsWith("ADR")){
            info["Direccion"] =  value.split(":")[1];
        }

        if (starts.startsWith("EMAIL")){
            info["email"] =  value.split(":")[1];
        }

        if (starts.startsWith("URL")){
            info["web"] =  value.split(":")[1] + ":" + value.split(":")[2];
        }
    });

    usersData.forEach(value => {
        if(value["correo"] === info["email"] || value["movil"] === info["Movil"]){
            Swal.fire(
                'Este usuario ya existe',
                'Por favor intente nuevamente',
                'error'
              )
            throw 'Break';
        }
    });
    var params = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "nombres": info["Nombre"],
            "movil":info["Movil"],
            "correo": info["email"],
            "direccion": info["Direccion"],
            "web" : info["web"],
            "empresa" : info["Empresa"],
            "telefono" : info["Telefono"]
        })
    }
    fetch('http://localhost:3002/insert',params)
    .then((response) =>{
        if(response.status === 200){
            html5QrcodeScanner.pause();
            Swal.fire({
                title: 'El usuario ' + info["Nombre"] + ' fue agregado exitosamente!' ,
                showDenyButton: false,
                showCancelButton: false,
                confirmButtonText: 'Save',
              }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    location.reload();
                }
              })
        } 
        })

}