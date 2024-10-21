document.addEventListener('DOMContentLoaded', () => {
    console.log("loaded")
    return new Promise((resolve, reject) => {
        fetch("./data.json")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then(data => {
                loadDescription(data);
                loadPage(data); 
            })
            .catch(error => reject(error));
    });
});

function loadDescription(jsonData) {
    let description = document.getElementById("header");
    let header = jsonData.header
    description.innerHTML = `
        <img src="${header.image}" alt="Header Image">
        <div class="header-text" id="pageDescription">
            <h1>${header.course}</h1>
            <h2>${header.semester}</h2>
            <h4>${header.date}</h4>
            <p>${header.description}</p>
        </div>
    `
    console.log(description);

}

function loadPage(jsonData) {
    let authors = jsonData.authors
    const authorContainer = document.getElementById("authorContainer");
    authors.forEach((author, index) => {
        const authorDiv = document.createElement("div");
        authorDiv.className = "col-lg-4 text-center author-box";

        authorDiv.innerHTML = `
            <div class="circle-image">
                <img id="author${index + 1}Image" src="${author.image}" alt="${author.name}" />
            </div>
            <h2 class="fw-normal" id="author${index + 1}Name">${author.name}</h2>
            <p><a id="author${index + 1}Email" href="mailto:${author.email}">${author.email}</a></p>
            <p id="author${index + 1}Description">${author.description}</p>
        `;

        authorContainer.appendChild(authorDiv);
    });
}

