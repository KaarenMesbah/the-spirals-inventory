const addbtn = document.getElementsByClassName("add")[0];
const itemadd = document.getElementsByClassName("itemadd")[0];
let form = document.getElementsByClassName("addform")[0];
const container = document.getElementsByClassName("container")[0];
const search = document.getElementById("search");
let selectedItems = [];
let items = [];

function toggle(x) {
    x.classList.toggle("hidden");
}

function refreshItems(re) {
    container.innerHTML = "";
    if (re == null) {
        drawItems(items);
    }
    else {
        drawItems(re);
    }
}

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        itemadd.classList.add("hidden");
    }
});

getItem();

document.querySelector(".close-btn").addEventListener("click", () => {
    search.value = "";
    refreshItems();
});

search.addEventListener("input", (e) => {
    const query = search.value.trim().toLowerCase();

    const words = query.split(/\s+/);

    const results = items.filter(item => {
        const name = String(item.name).toLowerCase();
        const category = String(item.category).toLowerCase();
        const id = String(item.id);

        return words.every(word =>
            id.includes(word) ||
            name.includes(word) ||
            category.includes(word)
        );
    });

    refreshItems(results);
});

function add() {
    toggle(itemadd);
    itemadd.innerHTML = `            <form class="addform">
                <input placeholder="name" name="name" required class="input-style" type="text" id="name">
                <input placeholder="price" name="price" required class="input-style num" type="number" id="price">
                <input placeholder="count" name="count" required class="input-style num" type="number" id="count">
                <span>*</span>
                <input placeholder="category" name="category" class="input-style" type="text" id="class">
                <button type="submit" class="button">
                    <svg aria-hidden="true" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path stroke-width="2" stroke="#fffffff"
                            d="M13.5 3H12H8C6.34315 3 5 4.34315 5 6V18C5 19.6569 6.34315 21 8 21H11M13.5 3L19 8.625M13.5 3V7.625C13.5 8.17728 13.9477 8.625 14.5 8.625H19M19 8.625V11.8125"
                            stroke-linejoin="round" stroke-linecap="round"></path>
                        <path stroke-linejoin="round" stroke-linecap="round" stroke-width="2" stroke="#fffffff"
                            d="M17 15V18M17 21V18M17 18H14M17 18H20"></path>
                    </svg>
                    ADD ITEM
                </button>

            </form>`;

    form = itemadd.querySelector(".addform");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        console.log("Form submitted!");

        const data = new FormData(form);
        addItem(data);
    });
}

async function addItem(data) {
    if (items.some(x => x.name.trim() === data.get('name').trim())) {
        alert('name should be unique!');
        return;
    }
    console.log(items);
    console.log(data);
    console.log(items.filter(x => x.name.includes(data.get('name'))));
    const response = await fetch("/add", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({ name: data.get('name'), price: data.get('price'), count: data.get('count'), category: data.get('category') }),
        // …
    });
    const result = await response.json();

    const element = { id: result.id, name: data.get('name'), price: Number(data.get('price')), count: data.get('count'), category: data.get('category') };
    items.push(element);
    drawItems([element]);
    toggle(itemadd);
}

async function getItem() {
    const response = await fetch("/items");
    const result = await response.json();
    items = result;
    drawItems(result);
}

function drawItems(result) {
    if (result.length != 0) {
        document.getElementsByClassName('empty')[0].classList.add('hidden');
    };
    for (let i = 0; i < result.length; i++) {
        const element = result[i];
        if (element.category == "" || element.category == null) {
            element.category = '-';
        }
        if (selectedItems.includes(element.id)) {
            container.innerHTML += `<div onclick="activate(${element.id})" class="item active" id = '${element.id}' ><span class="data">#${element.id}</span><span class="data">${element.name}</span><span class="data">${element.count}</span><span class="data">${element.price.toLocaleString()}$</span><span class="data">${element.category}</span><svg onclick="edit(${element.id})"
                    class="edit" xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"><!--!Font Awesome Free v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.-->
                    <path 
                        d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L368 46.1 465.9 144 490.3 119.6c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L432 177.9 334.1 80 172.4 241.7zM96 64C43 64 0 107 0 160L0 416c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-96c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 64z" />
                </svg></div></div>`
        }
        else {
            container.innerHTML += `<div onclick="activate(${element.id})" class="item" id = '${element.id}' ><span class="data">#${element.id}</span><span class="data">${element.name}</span><span class="data">${element.count}</span><span class="data">${element.price.toLocaleString()}$</span><span class="data">${element.category}</span><svg onclick="edit(${element.id})"
                    class="edit" xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"><!--!Font Awesome Free v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.-->
                    <path 
                        d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L368 46.1 465.9 144 490.3 119.6c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L432 177.9 334.1 80 172.4 241.7zM96 64C43 64 0 107 0 160L0 416c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-96c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 64z" />
                </svg></div></div>`
        }
    }

}

function edit(id) {
    if (items.some(x => x.name.trim() === data.get('name').trim())) {
        alert('name should be unique!');
        return;
    }
    activate(id);
    toggle(itemadd);
    itemadd.innerHTML = `            <form class="addform">
                <input placeholder="name" name="name" required class="input-style" type="text" id="name">
                <input placeholder="price" name="price" required class="input-style num" type="number" id="price">
                <input placeholder="count" name="count" required class="input-style num" type="number" id="count">
                <span>*</span>
                <input placeholder="category" name="category" class="input-style" type="text" id="class">
                <button type="submit" class="button">
                    <svg aria-hidden="true" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path stroke-width="2" stroke="#fffffff"
                            d="M13.5 3H12H8C6.34315 3 5 4.34315 5 6V18C5 19.6569 6.34315 21 8 21H11M13.5 3L19 8.625M13.5 3V7.625C13.5 8.17728 13.9477 8.625 14.5 8.625H19M19 8.625V11.8125"
                            stroke-linejoin="round" stroke-linecap="round"></path>
                        <path stroke-linejoin="round" stroke-linecap="round" stroke-width="2" stroke="#fffffff"
                            d="M17 15V18M17 21V18M17 18H14M17 18H20"></path>
                    </svg>
                    EDIT ITEM
                </button>

            </form>`;

    form = itemadd.querySelector(".addform");
    let item = items.filter(x => {
        return String(x.id).includes(String(id));
    });
    item = item[0];

    form.elements.name.value = item.name;
    form.elements.price.value = item.price;
    form.elements.count.value = item.count;
    form.elements.category.value = item.category;

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const data = new FormData(form);
        console.log("Form submitted!");

        requestEdit(id, data);
        const index = items.findIndex(item => item.id === id);

        if (index != -1) {
            items[index] = {
                ...items[index],
                name: data.get("name"),
                price: Number(data.get("price")),
                count: data.get("count"),
                category: data.get("category")
            };
        }
        toggle(itemadd);

        refreshItems();
    });
}

async function requestEdit(id, data) {
    const response = await fetch(`/items/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: data.get("name"),
            price: data.get("price"),
            count: data.get("count"),
            category: data.get("category")
        })
    });

    const result = await response.json();
    console.log(result);
}
const review = document.getElementsByClassName("review")[0];

function activate(id) {
    const element = document.getElementById(id);
    id = Number(id);
    const index = selectedItems.indexOf(id);

    console.log(index);
    if (index != -1) {
        element.classList.remove("active");
        selectedItems.splice(index, 1);
    } else {
        element.classList.add("active");
        selectedItems.push(id);
    }
    review.innerHTML = "";
    for (let i = 0; i < selectedItems.length; i++) {
        const ida = selectedItems[i];
        const element = items.filter(x => String(x.id).includes(ida))[0];
        review.innerHTML += `<div class="itemm">
                    <span class="data count" id = '${id}c'>1*</span>
                    <button class="state red">[-]</button>
                    <span class="data">${element.name}</span>
                    <button class="state">[+]</button>
                    <span class="max data">max ${element.count}</span>
                    <div>
                        <span class="data price">${element.price.toLocaleString()}$ * 1 = ${element.price.toLocaleString()}$</span>
                    </div>
                </div>`
    }
}
