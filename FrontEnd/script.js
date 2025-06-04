console.log("le fichier javascript fonctionne");



    fetch("http://localhost:5678/api/works")
        .then(response => response.json())
        .then(data => {
            data.forEach(project => {
                const gallery = document.querySelector(".gallery");
                console.log(project);
                const figure = document.createElement("figure");

                const img = document.createElement("img");
                img.src = project.imageUrl;
                img.alt = project.title;

                const caption = document.createElement("figcaption");
                caption.textContent = project.title;

                figure.appendChild(img);
                figure.appendChild(caption);

                gallery.appendChild(figure); //tout reste dans le bloc
            });
        })
        .catch(error => console.error("Erreur lors du fetch :", error));

fetch("http://localhost:5678/api/categories")
        .then(response => response.json())
        .then(categories => {
            console.log(categories);
        })
        .catch(error => console.error("Erreur lors de la recuperation des categories :", error));