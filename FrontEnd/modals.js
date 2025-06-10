// navigation entre les deux modales

const modalGallery = document.getElementById("modal");
const modalAdd = document.getElementById("modal-add");
const addPhotoBtn = document.getElementById("open-add-photo");
const closeBtns = document.querySelectorAll(".modal .close");

// ouvrir la modale d'ajout photo depuis la galerie
addPhotoBtn.addEventListener("click", () => {
    modalGallery.classList.add("hidden");
    modalAdd.classList.remove("hidden");
});

// fermer le modale ouvert au clic sur la croix
closeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        modalGallery.classList.add("hidden");
        modalAdd.classList.add("hidden");
    });
});

//fermer si un clic hors du modale
[modalGallery, modalAdd].forEach((modal) => {
    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.classList.add("hidden");
        }
    });
});

// previsualisation de l'image
const imageInput = document.getElementById("image");
const preview = document.getElementById("preview");

imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        preview.innerHTML = `<img src="${e.target.result}" alt="Aperçu" style="max-height: 150px">`;
    };
    reader.readAsDataURL(file);
});

// remplissage dynamique des catégories
fetch("http://localhost:5678/api/categories")
    .then((res) => res.json())
    .then((categories) => {
        const categorySelect = document.getElementById("category");
        categories.forEach((cat) => {
            const option = document.createElement("option");
            option.value = cat.id;
            option.textContent = cat.name;
            categorySelect.appendChild(option);
        });
    });

//soumission du formulaire
const form = document.getElementById("upload-form");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("image", imageInput.files[0]);
    formData.append("title", document.getElementById("title").value);
    formData.append("category", document.getElementById("category").value);

    const token = localStorage.getItem("token");

    try {
        const res = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formData,
        });

        if (!res.ok) throw new Error("Erreur lors de l'envoi");

        alert("Photoajoutée avec succès");
        form.reset();
        preview.innerHTML = "";
        modalAdd.classList.add("hidden");
        //optionnel : relancer le fetch des projets
    } catch (error) {
        alert("Erreur : " + error.message);
    }
});