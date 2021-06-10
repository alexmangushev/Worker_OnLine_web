const MQTT_on = document.getElementById('btn_on')
const MQTT_off = document.getElementById('btn_off')

function send(message_MQTT) {
    const message_MQTT_JSON = JSON.stringify(message_MQTT);

    //console.log(message_MQTT_JSON);
    alert("Сообщение отправлено")

    //отправляем данные через POST запрос /api/MQTT
    fetch('http://localhost:3000/api/MQTT', {
        method: 'POST', //тип запроса
        body: message_MQTT_JSON, // данные 
        headers: {
        'Content-Type': 'application/json'
        }
    }).then(function(response) {
        if (response.ok) {
            console.log("MQTT_ok")
        }
        else {
            console.log("MQTT_something wrong")
        }
    })
}

MQTT_on.onclick = function() {
    
    const type_message_MQTT = "on"

    const message_MQTT = {
        message: type_message_MQTT
    }
    setTimeout(send, 500, message_MQTT);

}

MQTT_off.onclick = function() {

    const type_message_MQTT = "off"

    const message_MQTT = {
        message: type_message_MQTT
    }
    setTimeout(send, 500, message_MQTT);

}

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
            alert("ok")
        }
        else {
            alert("something wrong")
        }
    })

}