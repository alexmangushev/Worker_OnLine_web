const express = require('express')
const { Sequelize, DataTypes, Model } = require('sequelize');
const app =express()
const validator = require('validator').default;
const cors = require('cors')
const { createToken, verifyToken, createPasswordHash, comparePassword } = require('./auth-service')
var mqtt = require('mqtt');

const sequelize = new Sequelize('worker_online_clients', 'Worker_OnLine_User', '12345', {
    host: 'localhost',
    dialect: 'mysql'
  });

class Order extends Model {}
class Admin extends Model {}

//функция для задания полей объектов, создаваемых в базе данных
function stringType() {
    return {
        type: DataTypes.STRING,
        allowNull: false
    }
}

Order.init({
      fio: stringType(),
      email: stringType(),
      message: stringType(),
}, {
      modelName: 'Order',
      sequelize
})

Admin.init({
    name: stringType(),
    password: stringType(),
}, {
    modelName: 'Admin',
    sequelize
})

start() //старт сервера

//подключение к бд и старт сервера
async function start() {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        console.log('Successful DB connection');
        start_App()
    } catch (error) {
        console.error(error)
    }
}

function start_App() {
    app.use(cors())
    app.use(express.json())

    app.get('/', function(req, res) {
        res.send('Hello from express')
    })

    app.post('/api/admin', async function (req, res) {
        const password_Hesh = createPasswordHash(req.body.password)
        const new_Admin = await Admin.create({
            name: req.body.name,
            password: password_Hesh
        })
        res.send(new_Admin)
    })

    app.post('/api/login', async function (req, res) {
        const user_From_DB = await Admin.findOne({ where: { name: req.body.name } })
        if (comparePassword(req.body.password, user_From_DB.password)) {
            const token = createToken(user_From_DB)
            res.send({
                token
            })
        } else {
            res.status(403).send({
                message: 'Wrong password'
            })
        }
    })

    //получение сообщений из базы данных для админа
    app.get('/api/order', verifyToken, async function (req, res) {
        const orders = await Order.findAll()
        res.send(orders)
    })

    //обрабатываем POST запрос /api/order
    app.post('/api/order', async function (req, res) {
        const Data_Order = req.body

        let validation_Error = []

        //проверка почты и длины имени
        if (!validator.isLength(Data_Order.fio, {min: 4, max: 80}))
            validation_Error.push('Wrong fio')
        if (!validator.isEmail(Data_Order.email)) 
            validation_Error.push('Wrong e-mail')

        if(validation_Error.length) {
            res.status(400).send({message: validation_Error})
        } else {
            const Order_From_DB = await Order.create (Data_Order)
            res.send(Order_From_DB)
        }

    })

    //обрабатываем POST запрос /api/MQTT
    app.post('/api/MQTT', async function (req, res) {
        const Data_MQTT = req.body;

        console.log(Data_MQTT.message);

        var client = mqtt.connect('mqtt://broker.mqttdashboard.com',{
          will: {
            topic: 'scooter1',
            qos: 0,
            retain: false
          }
        });

        if (Data_MQTT.message == "on")
        {
            
            client.publish('scooter1', ';on', 
            {
                qos: 0
            }, () => {})
            console.log('включаю')
            


        } else 
        {
            if (Data_MQTT.message == "off")
            {
                
                client.publish('scooter1', ';of', 
                {
                    qos: 0
                }, () => {})
                console.log('выключаю')
                
            }
        }

    })
    
    app.listen(3000, function() {
        console.log('Server started at http://localhost:3000');
    })
}
