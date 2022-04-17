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

const searchMessages = (url) => axios.get(url);

const newMessages = (message) => message;



const printMessages = (response) => {
    let msgType;
    const messageList = qs('.chat-container ul');
    messageList.innerHTML = "";
    const messages = response.data.map(newMessages)
    console.log(response);
    messages.forEach(message => {
        switch (message.status) {
            case "status":
                msgType = "status";
            case "private_message":
                msgType = "private";
            default:
                msgType = "normal";
        }
        const msg = `
            <li class="${msgType}">
                <div class="message-container">
                    <span class="time">${message.time}</span>
                    <span class="to-from">De <strong>${message.from}</strong> para <strong>${message.to}</strong>:</span>
                    <span>${message.text}</span>
                </div>
            </li>
            `
        messageList.innerHTML += msg;
    })
};

const getMessage = () => {
    let promise = searchMessages(messageHandler(false));
    promise.then(printMessages);
};

const sendMessage = (url, message) => axios.post(url, message);

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

function sentSuccesful(ele) {
    setTimeout(() => ele.textContent = "Enviado com sucesso!", 1000);
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
        const promise = sendMessage(messageAPI, message);
        const sendingEle = qs('.send-message-container span');
        sendingEle.classList.add('active');
        promise.then(sentSuccesful(sendingEle));
        setTimeout(() => sendingEle.classList.remove('active'), 4000)
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






