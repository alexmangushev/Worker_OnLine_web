const jwt = require('jsonwebtoken')
const secret = 'super_secret'
const bcryptjs = require('bcryptjs')

//создание токена
function createToken(userFromDB) {
    const token = jwt.sign({ id: userFromDB.id }, secret,
        { expiresIn: "2 days" })
    return 'bearer ' + token
}

//проверка токена
function verifyToken(req, res, next) {
    if (req.headers['authorization'] && req.headers['authorization'].length) {
        const token = req.headers['authorization'].replace(/(bearer|jwt)\s+/, '')
        jwt.verify(token, secret, (err, decodedToken) => {
            if (err) {
                return res.status(401).send({ message: "Failed to authenticate token" }) 
            }
            req.credentials = { id: decodedToken.id }
            next()
        })
    } else {
        return res.status(401).send({ message: "Failed to authenticate token" })
    }
}

//создаем hesh пароля с солью
function createPasswordHash(password) {
    const salt = bcryptjs.genSaltSync(10)
    return bcryptjs.hashSync(password, salt)
}

//hesh-ируем переданный пароль и сверяем с тем, что хранится на сервере
function comparePassword(password, hash) {
    if (typeof password === 'string') return bcryptjs.compareSync(password, hash)
    else return false
}

module.exports = {
    createToken,
    verifyToken,
    createPasswordHash,
    comparePassword
}