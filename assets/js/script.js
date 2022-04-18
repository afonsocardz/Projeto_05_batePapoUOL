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

let lastMessages = false;

const isOnline = (url, user) => axios.post(url, user).then().catch();

const chatSignIn = (url, user) => axios.post(url, user)
    .then(response => {
        loggedUser.name = user.name
        console.log(response);
    })
    .catch();

const searchMessages = (url) => axios.get(url);

const newMessages = (message) => {
    lastMessages.forEach(lastMsg => {
        console.log(lastMsg);
        if(message !== lastMsg){
            return message;
        }
    });
};

const privacyMsg = (message) => (message.to === loggedUser.name || message.to === "Todos");
    


const msgType = (message) => {
    let type;
    if (message.type === "status") {
        type = "status";
        const msg = `
        <li class="${type}">
            <div class="message-container">
                <span class="time">${message.time}</span>
                <span class="to-from"><strong>${message.from}</strong></span>
                <span>${message.text}</span>
            </div>
        </li>
        `
        return msg;
    }
    if (message.type === "private_message") {
        type = "private";
    }
    if (message.type === "message") {
        type = "normal";
    }
    const msg = `
        <li class="${type}">
            <div class="message-container">
                <span class="time">${message.time}</span>
                <span class="to-from">De <strong>${message.from}</strong> para <strong>${message.to}</strong>:</span>
                <span>${message.text}</span>
            </div>
        </li>
        `
    return msg;
}

const printMessages = (response) => {
    let private;
    const messageList = qs('.chat-container ul');
    let messages = response.data.map(message => message);
    private = messages.filter(privacyMsg);
    let styledMsgs = private.map(msgType);
    if (!lastMessages){
        styledMsgs.forEach(message => {
            messageList.innerHTML += message;
        })
        lastMessages = private.map((message)=>message);
        return;
    }
    lastMessages = private.filter(newMessages);
    styledMsgs = lastMessages.map(msgType);
    styledMsgs.forEach(msg => {
        messageList.innerHTML += msg;
    });
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
    setInterval(getMessage, 2000);
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






