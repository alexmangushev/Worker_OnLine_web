/*const MQTT_on = document.getElementById('btn_on')
const MQTT_off = document.getElementById('btn_off')

MQTT_on.onclick = function() {
    console.log("on");
}

MQTT_off.onclick = function() {
    console.log("off");
}*/

/*
* inputs names
* fio
* e-mail
* info
*/


const btn_in = document.getElementById('btn_send')

btn_in.onclick = function() {
    const form = document.getElementById('form')

    //Данные сообщения
    const fio = form.fio.value;
    const email = form.email.value;
    const message = form.info.value;

    const message_info = {
        fio: fio,
        email: email,
        message: message
    }

    const message_info_JSON = JSON.stringify(message_info);

    //console.log(message_info_JSON); 

    //отправляем данные через POST запрос /api/order
    fetch('http://localhost:3000/api/order', {
        method: 'POST', //тип запроса
        body: message_info_JSON, // данные 
        headers: {
        'Content-Type': 'application/json'
        }
    }).then(function(response) {
        if (response.ok) {
            console.log("ok")
        }
        else {
            console.log("something wrong")
        }
    })

}