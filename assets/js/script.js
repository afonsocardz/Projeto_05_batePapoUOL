function qs(selector, parent = document) {
    return parent.querySelector(selector);
}

function createElement(type, options = {}) {
    const element = document.createElement(type);

    Object.entries(options).forEach(([key, value]) => {
        if (key === "class") {
            element.classList.add(value);
            return
        }
        if (key === "text") {
            element.textContent = value;
            return
        }
        element.setAttribute(key, value);
    });
    return element;
}

const isOnline = (url, user) => axios.post(url, user).then().catch();

const chatSignIn = (url, user) => axios.post(url, user)
    .then(response => {
        loggedUser.name = user.name
        console.log(response);
    })
    .catch();

const searchMessages = (url) => axios.get(url).then( response => console.log(response)).catch();

const getMessage = () => searchMessages(messageHandler(false));

const sendMessage = (url, message) => axios.post(url, message).then().catch();

function setLogin(user) {
    const userAPI = "https://mock-api.driven.com.br/api/v6/uol/participants";
    chatSignIn(userAPI, user);
}

function loginUser() {
    const userName = qs('input[name="user"]').value;
    const loginContainer = qs('.login-container');
    const user = {
        name: userName
    }
    setLogin(user);
    loginContainer.classList.add('hidden');
    setInterval(checkOnline, 4000);
    setInterval(getMessage, 1000);
}

function checkOnline() {
    let statusAPI = "https://mock-api.driven.com.br/api/v6/uol/status";
    let user = loggedUser;
    isOnline(statusAPI, user);
}

function sendTo(ele) {
    const option = qs('span', ele).textContent;
    console.log(option)
    receiver.name = option;
}

function messageHandler(isSending) {
    const messageAPI = "https://mock-api.driven.com.br/api/v6/uol/messages";
    if (isSending) {
        const messageString = qs('input[name="message"]').value;
        const user = loggedUser.name;
        const msgTo = receiver.name;
        const message = {
            from: user,
            to: msgTo,
            text: messageString,
            type: "message" // ou "private_message" para o bônus
        }
        sendMessage(messageAPI, message);
        return
    }
    return messageAPI;
}

const loggedUser = {
    name: ""
}

const receiver = {
    name: "Todos"
}






