document.getElementById("login-form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("token", data.token);
            window.location.href = "index.html";
        } else {
            document.getElementById("login-error").textContent = "Email ou mot de passe incorrect";
        }
    } catch (error) {
        document.getElementById("login-error").textContent = "Une erreur est survenue";
    }
});