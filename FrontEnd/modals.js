const modal = document.getElementById("modal");
const closeBtn = document.querySelector(".close");
const editBtn = document.querySelector(".edit-button");

editBtn.addEventListener("click", () => {
    modal.classList.remove("hidden");
    displayWorksInModals();
});

async function fetchWorks() {
    try {
        const res = await fetch("http://localhost:5678/api/works");
        if (!res.ok) throw new Error("Impossible de récuperer le projets.");
        return await res.json();
    } catch (err) {
        console.error("Erreur dans fetchWorks() :", err);
        return [];
    }
}

async function displayWorksInModals() {
    const token = localStorage.getItem("token");
    try {
        const res = await fetch("http://localhost:5678/api/works", {
            headers: {
                Authorization : `Bearer ${token}`
            }
        });
        const works = await res.json();

        const modalGallery = document.querySelector(".modal-gallery");
        modalGallery.innerHTML = ""

        works.forEach(work => {
            const figure = document.createElement("figure");
            figure.classList.add("modal-figure");
            figure.dataset.id = work.id;

            const img = document.createElement("img");
            img.src = work.imageUrl;
            img.alt = work.title

            const trash = document.createElement("i");
            trash.classList.add("fa-solid", "fa-trash-can", "delete-icon");

            trash.addEventListener("click", async () => {
                const confirmed = confirm("Voulez-vous vraiment supprimer cette photo ?");
                if (!confirmed) return;

                try {
                    const res = await fetch(`http://localhost:5678/api/works/${work.id}`, {
                        method: "DELETE",
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    });

                    if (!res.ok) {
                        const errorText = await res.text();
                        throw new Error(`Erreur HTTP ${res.status} : ${errorText}`);
                    }

                    figure.remove();
                    console.log(`Projet ID ${work.id} supprimé`);

                    const updateWorks = await fetchWorks();
                    displayProjects(updateWorks);

                } catch (err) {
                    console.error("Erreur lors de la suppression :", err);
                    alert("Erreur lors de la suppression : " + err.message);
                }
            });

            figure.appendChild(img);
            figure.appendChild(trash);
            modalGallery.appendChild(figure);
        });
    } catch (err) {
        console.error("Erreur lors du chargement des projets : ", err);
    }
}

modal.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.classList.add("hidden");
    }
});

closeBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
});

const btnBack = document.querySelector(".back-button");
btnBack.addEventListener("click", () => {
    modalAdd.classList.add("hidden");
    modalGallery.classList.remove("hidden");
})

const modalGallery = document.getElementById("modal");
const modalAdd = document.getElementById("modal-add");
const addPhotoBtn = document.getElementById("open-add-photo");
const closeBtns = document.querySelectorAll(".modal .close");

addPhotoBtn.addEventListener("click", () => {
    modalGallery.classList.add("hidden");
    modalAdd.classList.remove("hidden");
});

closeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        modalGallery.classList.add("hidden");
        modalAdd.classList.add("hidden");
    });
});

[modalGallery, modalAdd].forEach((modal) => {
    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.classList.add("hidden");
        }
    });
});

const imageInput = document.getElementById("image");
const preview = document.getElementById("preview");

imageInput.addEventListener("change", checkFormValidity);
document.getElementById("title").addEventListener("input", checkFormValidity);
document.getElementById("category").addEventListener("change", checkFormValidity);

imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        preview.innerHTML = `<img src="${e.target.result}" alt="Aperçu" style="max-height: 150px">`;
        document.querySelector(".upload-zone").classList.add("preview-active");
        document.querySelector(".upload-zone").classList.add("preview-active");
    };
    reader.readAsDataURL(file);
});

fetch("http://localhost:5678/api/categories")
    .then((res) => res.json())
    .then((categories) => {
        const categorySelect = document.getElementById("category");
        categorySelect.innerHTML = `
        <option value="" disabled selected hidden>-- Choisissez une catégorie --</option>
        `;
        categories.forEach((cat) => {
            const option = document.createElement("option");
            option.value = cat.id;
            option.textContent = cat.name;
            categorySelect.appendChild(option);
        });
    });

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

        alert("Photo ajoutée avec succès");
        form.reset();
        preview.innerHTML = "";
        modalAdd.classList.add("hidden");
    } catch (error) {
        alert("Erreur : " + error.message);
    }
});

function checkFormValidity() {
    const imageLoaded = imageInput.files.length > 0;
    const titleFilled = document.getElementById("title").value.trim() !== "";
    const categorySelect = document.getElementById("category").value !== "";

    const submitBtn = document.querySelector('#upload-form input[type="submit"]');

    if (imageLoaded && titleFilled && categorySelect) {
        submitBtn.classList.add("active");
        submitBtn.disabled = false;
        submitBtn.style.cursor = "pointer";
    } else {
        submitBtn.classList.remove("active");
        submitBtn.disabled = true;
        submitBtn.style.cursor = "not-allowed";
    }
}