document.addEventListener("DOMContentLoaded", () => {
    getBooks();
});

function getBooks() {
    fetch('http://localhost:3000/books')
    .then(res => res.json())
    .then(bookData => bookData.forEach(renderBook))
}
function renderBook(book) {
    let divList = document.getElementById("list")
    let makeBook = document.createElement("li")
    makeBook.innerText = book.title
    makeBook.dataset.id = book.id
    divList.appendChild(makeBook)
    makeBook.addEventListener('click', bookClick)
}
function bookClick(e) {
    getSingleBook(e.target.dataset.id)
    .then(showBookInfo)

}
function showBookInfo(book) {
    let panel = document.getElementById("show-panel")
    while (panel.hasChildNodes()){
        panel.removeChild(panel.firstChild)
    }
    let image = document.createElement("img")
    image.src = book.img_url
    let title = document.createElement("h3")
    title.innerText = book.title
    let subtitle = document.createElement('h3')
    subtitle.innerText = book.subtitle
    let description = document.createElement('p')
    description.innerText = book.description
    let ul = document.createElement('ul')
    book.users.forEach((user) => {
        let li = document.createElement('li')
        li.innerText = user.username
        li.dataset.id = user.id
        ul.appendChild(li)
    })

    let button = document.createElement("button")
    button.innerText = "LIKE"
    button.dataset.id = book.id 
    panel.append(image, title, subtitle, description, ul, button)

    button.addEventListener('click', clickLike)
}

function clickLike(e) {
    getSingleBook(e.target.dataset.id)
    .then(likeBook)
}
function likeBook(book) {
    button = document.querySelector("button")
    let newusers = book.users
    let me = {id: 1, username: "pouros"}

    if (button.innerText == "LIKE"){
        button.innerText = "UNLIKE"
        newusers.push(me)
    }
    else if (button.innerText == "UNLIKE"){
        button.innerText = "LIKE"
        let newArray = []
        newusers.forEach((user) => {
            for (i = 0; i < newusers.length; i++){
                if (newusers[i].id == me.id){
                    newusers.splice(i, 1)
                }
            }
        })

    }
    let newObj = {users: newusers}
    let reqObj = {
        headers: {"Content-Type": "application/json", Accept: "application/json"}, 
        method: "PATCH", 
        body: JSON.stringify(newObj)
    }
    fetch('http://localhost:3000/books/' + book.id, reqObj)
    .then(r => r.json())
    .then(updated => {
        let ul = document.getElementById("show-panel").querySelector("ul")
        while (ul.hasChildNodes()){
            ul.removeChild(ul.firstChild)
        }

        updated.users.forEach((user) => {
            let li = document.createElement('li')
            li.innerText = user.username
            li.dataset.id = user.id
            ul.appendChild(li)
        })
    })
     
}
function removeUsers() {
    let list = document.getElementById("show-panel").querySelector("ul")
    while (list.hasChildNodes()){
        list.removeChild(list.firstChild)
    }
}

function getSingleBook(id) {
    return fetch('http://localhost:3000/books/' + id)
    .then(res => res.json())
}