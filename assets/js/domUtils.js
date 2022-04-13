export function qs(selector, parent = document){
    return parent.querySelector(selector);
}

export function createElement (type, options =  {}){
    const element = document.createElement(type);

    Object.entries(options).forEach(([key, value])=> {
        if (key === "class"){
            element.classList.add(value);
            return
        }
        if (key === "text"){
            element.textContent = value;
            return
        }
        element.setAttribute(key, value);
    });
    return element;
}