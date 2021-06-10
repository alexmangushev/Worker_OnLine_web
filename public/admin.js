const root = document.getElementById('root')
const domain = 'http://localhost:3000'

const login_Page = /* html */`
<form class="login-form" onsubmit="loginSubmit(event)">
  <div>
    <label for="login" class="form-label">Login</label>
    <input type="text" class="form-control" id="login" aria-describedby="loginHelp" name="login">
    <div id="loginHelp" class="form-text"></div>
  </div>
  <div>
    <label for="password" class="form-label">Password</label>
    <input type="password" class="form-control" id="password" name="password">
  </div>
  <button type="submit" class="btn btn-primary btn-login">Login</button>
</form>`

function ordersPage(orders = []) {
  return /* html */`
    <table class="table">
    <thead>
      <tr>
        <th scope="col">id</th>
        <th scope="col">fio</th>
        <th scope="col">email</th>
        <th scope="col">message</th>
      </tr>
    </thead>
    <tbody>
      ${orders.map((order) => {
        return /* html */`
        <tr>
          <th scope="row">${order.id}</th>
          <td>${order.fio}</td>
          <td>${order.email}</td>
          <td>${order.message}</td>
        </tr>
        `
      }).join(' ')}
    </tbody>
    </table>
  `
} 


//авторизация админа
async function loginSubmit(event) {
  event.preventDefault()
  const form = event.target

  //вытаскиваем логин и пароль из формы
  const login_Value = form.login.value;
  const password_Value = form.password.value;

  //отправляем POST запрос с данными на страницу авторизации
  const response = await fetch(`${domain}/api/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: login_Value,
      password: password_Value
    })
  })
  //если ответ верный то сверяем токен показываем содержимое DB
  if (response.ok) {
    const tokenInfo = await response.json()
    localStorage.setItem('Token', tokenInfo.token)
    renderOrders()
  }
}



//получаем данные из базы и отправляем их
async function renderOrders() {
  const token = localStorage.getItem('Token')

  if (token) {
  const response = await fetch(`${domain}/api/order`, {
      headers: {
      'Authorization': token
      }
  })

  if (response.ok) {
      const orders = await response.json()
      root.innerHTML = ordersPage(orders)
  } else {
      root.innerHTML = login_Page
  }
  } else {
  root.innerHTML = login_Page
  }
}


renderOrders()