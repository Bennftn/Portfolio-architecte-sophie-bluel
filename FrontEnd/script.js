let allProjects = [];

console.log("le fichier javascript fonctionne");

fetch("http://localhost:5678/api/works")
    .then(response => response.json())
    .then(data => {
        allProjects = data;
        displayProjects(allProjects);
    })
    .catch(error => console.error("Erreur lors du fetch :", error));

fetch("http://localhost:5678/api/categories")
    .then(response => response.json())
    .then(categories => {
        const filtersContainer = document.querySelector(".filters");

        // Créer le bouton "Tous"
        const allBtn = document.createElement("button");
        allBtn.textContent = "Tous";
        allBtn.dataset.id = 0;
        filtersContainer.appendChild(allBtn);

        // Créer les boutons des catégories
        categories.forEach(category => {
            const button = document.createElement("button");
            button.textContent = category.name;
            button.dataset.id = category.id;
            filtersContainer.appendChild(button);
        });

        // 👉 Attacher les événements juste après la création
        const allButtons = document.querySelectorAll(".filters button");

        allButtons.forEach(button => {
            button.addEventListener("click", () => {
                const categoryId = parseInt(button.dataset.id);
                console.log("Bouton cliqué : catégorie", categoryId);

                if (categoryId === 0) {
                    displayProjects(allProjects);
                } else {
                    const filtered = allProjects.filter(
                        project => project.categoryId === categoryId
                    );
                    displayProjects(filtered);
                }
            });
        });
    })
    .catch(error => console.error("Erreur lors de la récupération des catégories :", error));

function displayProjects(projects) {
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";

    projects.forEach(project => {
        const figure = document.createElement("figure");

        const img = document.createElement("img");
        img.src = project.imageUrl;
        img.alt = project.title;

        const caption = document.createElement("figcaption");
        caption.textContent = project.title;

        figure.appendChild(img);
        figure.appendChild(caption);

        gallery.appendChild(figure);
    });
}
