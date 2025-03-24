HEAD
// ✅ Fonction pour extraire l'ID de la vidéo
function getVideoId(url) {
    const regex = /(?:youtube\.com\/.*[?&]v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

function updateThumbnail() {
    const videoUrl = document.getElementById('videoUrl').value.trim();
    const resolution = document.getElementById('resolution').value;
    const resultDiv = document.getElementById('result');
    const errorMessage = document.getElementById('error-message');
    const spinner = document.getElementById('loading-spinner');

    // ✅ Vérifier si l'utilisateur a une connexion Internet
    if (!navigator.onLine) {
        resultDiv.innerHTML = "";
        errorMessage.textContent = "⚠ No internet connection. Please check your network.";
        errorMessage.style.display = "block";
        return;
    }

    // ✅ Vérifier si l’URL collée est un lien YouTube valide
    const videoId = getVideoId(videoUrl);
    if (!videoId) {
        resultDiv.innerHTML = ""; // Effacer toute image incorrecte
        errorMessage.textContent = "❌ Invalid YouTube URL. Please enter a valid link.";
        errorMessage.style.display = "block";
        return;
    }

    // ✅ Si l'URL est correcte, cacher le message d'erreur
    errorMessage.style.display = "none";
    spinner.style.display = "block";

    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/${resolution}.jpg`;

    // ✅ Charger l’image uniquement si la connexion est active
    const img = new Image();
    img.crossOrigin = "anonymous"; 
    img.src = thumbnailUrl;

    img.onload = function () {
        spinner.style.display = "none";
        resultDiv.innerHTML = `<img src="${thumbnailUrl}" class="img-fluid rounded shadow-sm">`;
    };

    // ✅ Si l’image ne charge pas (problème de vidéo inexistante)
    img.onerror = function () {
        spinner.style.display = "none";
        resultDiv.innerHTML = "";
        errorMessage.textContent = "❌ Failed to load thumbnail. The video may not exist.";
        errorMessage.style.display = "block";
    };
}



// ✅ Fonction pour convertir l'image en canvas et la télécharger
function downloadThumbnail(url) {
    const img = new Image();
    img.crossOrigin = "anonymous"; // Éviter les restrictions CORS
    img.src = url;

    img.onload = function () {
        // ✅ Création d’un canvas pour dessiner l’image
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");

        // ✅ Dessiner l’image sur le canvas
        ctx.drawImage(img, 0, 0, img.width, img.height);

        // ✅ Convertir en image et déclencher le téléchargement
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png"); // Convertir en PNG
        link.download = "youtube-thumbnail.png"; // Nom du fichier
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    img.onerror = function () {
        alert("❌ Erreur lors du chargement de l'image. Veuillez réessayer.");
    };
}


// ✅ Fonction pour réinitialiser le formulaire
function resetForm() {
    document.getElementById('videoUrl').value = '';
    document.getElementById('resolution').value = 'maxresdefault';
    document.getElementById('result').innerHTML = '';
    document.getElementById('error-message').style.display = "none";
    document.getElementById('clearUrl').style.display = "none";
}

// ✅ Fonction pour activer/désactiver le mode sombre
document.getElementById("darkModeToggle").addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
});

// ✅ Appliquer le mode sombre enregistré
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
}

// ✅ Affichage du bouton "X" pour effacer l'URL
document.getElementById("videoUrl").addEventListener("input", function () {
    document.getElementById("clearUrl").style.display = this.value ? "inline-block" : "none";
    updateThumbnail(); // Met à jour l’image automatiquement
});

document.getElementById("clearUrl").addEventListener("click", function () {
    document.getElementById("videoUrl").value = "";
    document.getElementById("result").innerHTML = "";
    document.getElementById('error-message').style.display = "none";
    this.style.display = "none";
});

// ✅ Met à jour l’image dès que l’utilisateur change la résolution
document.getElementById("resolution").addEventListener("change", updateThumbnail);

// ✅ Attendre que le DOM soit chargé avant d’exécuter le script
document.addEventListener("DOMContentLoaded", function () {
    const inputField = document.getElementById("videoUrl");
    const clearBtn = document.getElementById("clearUrl");
    const resultDiv = document.getElementById("result");
    const errorMessage = document.getElementById("error-message");

    // ✅ Vérifier si les éléments existent pour éviter les erreurs
    if (!inputField || !clearBtn || !resultDiv || !errorMessage) {
        console.error("❌ Erreur : Un des éléments nécessaires (#videoUrl, #clearUrl, #result, #error-message) est introuvable.");
        return;
    }

    // ✅ Afficher la croix seulement si du texte est entré
    inputField.addEventListener("input", function () {
        if (this.value.trim() !== "") {
            clearBtn.classList.remove("d-none"); // Afficher la croix
        } else {
            clearBtn.classList.add("d-none"); // Cacher la croix
        }
    });

    // ✅ Effacer l'URL, masquer la croix, et supprimer l'image au clic
    clearBtn.addEventListener("click", function () {
        inputField.value = ""; // Effacer le champ
        clearBtn.classList.add("d-none"); // Cacher la croix
        resultDiv.innerHTML = ""; // Supprimer l’image affichée
        errorMessage.style.display = "none"; // Cacher le message d’erreur
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const pageUrl = encodeURIComponent(window.location.href);
    const shareText = encodeURIComponent("Check out this awesome YouTube Thumbnail Downloader!");

    // Facebook
    document.getElementById("share-facebook").href = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;

    // WhatsApp
    document.getElementById("share-whatsapp").href = `https://wa.me/?text=${shareText} ${pageUrl}`;

    // Twitter
    document.getElementById("share-twitter").href = `https://twitter.com/intent/tweet?text=${shareText}&url=${pageUrl}`;
});

// ✅ Rafraîchir la page quand on clique sur le logo
document.addEventListener("DOMContentLoaded", function () {
    const logo = document.getElementById("siteLogo");
    if (logo) {
        logo.addEventListener("click", function (event) {
            event.preventDefault(); // Empêche le comportement par défaut
            location.reload(); // Recharge la page
        });
    }
});

// ✅ Vérifier la connexion Internet avec animation
function checkInternetConnection() {
    const errorDiv = document.getElementById("connection-error");

    if (!navigator.onLine) {
        errorDiv.classList.add("show"); // Afficher avec animation
        errorDiv.classList.remove("d-none");
    } else {
        errorDiv.classList.remove("show"); // Masquer avec animation
        setTimeout(() => errorDiv.classList.add("d-none"), 500);
    }
}


// ✅ Vérifier la connexion au chargement
document.addEventListener("DOMContentLoaded", function () {
    checkInternetConnection(); // Vérifier dès le chargement de la page

    // ✅ Vérifier la connexion en temps réel
    window.addEventListener("offline", checkInternetConnection);
    window.addEventListener("online", checkInternetConnection);
});

document.addEventListener("DOMContentLoaded", function () {
    // ✅ Vider automatiquement le champ URL au chargement
    const videoUrlInput = document.getElementById("videoUrl");
    if (videoUrlInput) {
        videoUrlInput.value = ""; // Vide le champ URL
    }
});
document.addEventListener("DOMContentLoaded", function () {
    const videoUrlInput = document.getElementById("videoUrl");
    const clearUrlBtn = document.getElementById("clearUrl");

    function toggleClearButton() {
        if (videoUrlInput.value.trim() !== "") {
            clearUrlBtn.classList.remove("d-none");
        } else {
            clearUrlBtn.classList.add("d-none");
        }
    }

    // Vérifie immédiatement l'état de la croix au chargement de la page
    toggleClearButton();

    // Écouteur d'événement sur l'entrée pour afficher/cacher la croix
    videoUrlInput.addEventListener("input", toggleClearButton);

    // Clic sur la croix pour réinitialiser le champ
    clearUrlBtn.addEventListener("click", function () {
        videoUrlInput.value = "";
        clearUrlBtn.classList.add("d-none");
        document.getElementById("result").innerHTML = "";
        document.getElementById('error-message').style.display = "none";
    });
});
// ✅ Fonction pour extraire l'ID de la vidéo
function getVideoId(url) {
    const regex = /(?:youtube\.com\/.*[?&]v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

function updateThumbnail() {
    const videoUrl = document.getElementById('videoUrl').value.trim();
    const resolution = document.getElementById('resolution').value;
    const resultDiv = document.getElementById('result');
    const errorMessage = document.getElementById('error-message');
    const spinner = document.getElementById('loading-spinner');

    // ✅ Vérifier si l'utilisateur a une connexion Internet
    if (!navigator.onLine) {
        resultDiv.innerHTML = "";
        errorMessage.textContent = "⚠ No internet connection. Please check your network.";
        errorMessage.style.display = "block";
        return;
    }

    // ✅ Vérifier si l’URL collée est un lien YouTube valide
    const videoId = getVideoId(videoUrl);
    if (!videoId) {
        resultDiv.innerHTML = ""; // Effacer toute image incorrecte
        errorMessage.textContent = "❌ Invalid YouTube URL. Please enter a valid link.";
        errorMessage.style.display = "block";
        return;
    }

    // ✅ Si l'URL est correcte, cacher le message d'erreur
    errorMessage.style.display = "none";
    spinner.style.display = "block";

    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/${resolution}.jpg`;

    // ✅ Charger l’image uniquement si la connexion est active
    const img = new Image();
    img.crossOrigin = "anonymous"; 
    img.src = thumbnailUrl;

    img.onload = function () {
        spinner.style.display = "none";
        resultDiv.innerHTML = `<img src="${thumbnailUrl}" class="img-fluid rounded shadow-sm">`;
    };

    // ✅ Si l’image ne charge pas (problème de vidéo inexistante)
    img.onerror = function () {
        spinner.style.display = "none";
        resultDiv.innerHTML = "";
        errorMessage.textContent = "❌ Failed to load thumbnail. The video may not exist.";
        errorMessage.style.display = "block";
    };
}



// ✅ Fonction pour convertir l'image en canvas et la télécharger
function downloadThumbnail(url) {
    const img = new Image();
    img.crossOrigin = "anonymous"; // Éviter les restrictions CORS
    img.src = url;

    img.onload = function () {
        // ✅ Création d’un canvas pour dessiner l’image
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");

        // ✅ Dessiner l’image sur le canvas
        ctx.drawImage(img, 0, 0, img.width, img.height);

        // ✅ Convertir en image et déclencher le téléchargement
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png"); // Convertir en PNG
        link.download = "youtube-thumbnail.png"; // Nom du fichier
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    img.onerror = function () {
        alert("❌ Erreur lors du chargement de l'image. Veuillez réessayer.");
    };
}


// ✅ Fonction pour réinitialiser le formulaire
function resetForm() {
    document.getElementById('videoUrl').value = '';
    document.getElementById('resolution').value = 'maxresdefault';
    document.getElementById('result').innerHTML = '';
    document.getElementById('error-message').style.display = "none";
    document.getElementById('clearUrl').style.display = "none";
}

// ✅ Fonction pour activer/désactiver le mode sombre
document.getElementById("darkModeToggle").addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
});

// ✅ Appliquer le mode sombre enregistré
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
}

// ✅ Affichage du bouton "X" pour effacer l'URL
document.getElementById("videoUrl").addEventListener("input", function () {
    document.getElementById("clearUrl").style.display = this.value ? "inline-block" : "none";
    updateThumbnail(); // Met à jour l’image automatiquement
});

document.getElementById("clearUrl").addEventListener("click", function () {
    document.getElementById("videoUrl").value = "";
    document.getElementById("result").innerHTML = "";
    document.getElementById('error-message').style.display = "none";
    this.style.display = "none";
});

// ✅ Met à jour l’image dès que l’utilisateur change la résolution
document.getElementById("resolution").addEventListener("change", updateThumbnail);

// ✅ Attendre que le DOM soit chargé avant d’exécuter le script
document.addEventListener("DOMContentLoaded", function () {
    const inputField = document.getElementById("videoUrl");
    const clearBtn = document.getElementById("clearUrl");
    const resultDiv = document.getElementById("result");
    const errorMessage = document.getElementById("error-message");

    // ✅ Vérifier si les éléments existent pour éviter les erreurs
    if (!inputField || !clearBtn || !resultDiv || !errorMessage) {
        console.error("❌ Erreur : Un des éléments nécessaires (#videoUrl, #clearUrl, #result, #error-message) est introuvable.");
        return;
    }

    // ✅ Afficher la croix seulement si du texte est entré
    inputField.addEventListener("input", function () {
        if (this.value.trim() !== "") {
            clearBtn.classList.remove("d-none"); // Afficher la croix
        } else {
            clearBtn.classList.add("d-none"); // Cacher la croix
        }
    });

    // ✅ Effacer l'URL, masquer la croix, et supprimer l'image au clic
    clearBtn.addEventListener("click", function () {
        inputField.value = ""; // Effacer le champ
        clearBtn.classList.add("d-none"); // Cacher la croix
        resultDiv.innerHTML = ""; // Supprimer l’image affichée
        errorMessage.style.display = "none"; // Cacher le message d’erreur
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const pageUrl = encodeURIComponent(window.location.href);
    const shareText = encodeURIComponent("Check out this awesome YouTube Thumbnail Downloader!");

    // Facebook
    document.getElementById("share-facebook").href = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;

    // WhatsApp
    document.getElementById("share-whatsapp").href = `https://wa.me/?text=${shareText} ${pageUrl}`;

    // Twitter
    document.getElementById("share-twitter").href = `https://twitter.com/intent/tweet?text=${shareText}&url=${pageUrl}`;
});

// ✅ Rafraîchir la page quand on clique sur le logo
document.addEventListener("DOMContentLoaded", function () {
    const logo = document.getElementById("siteLogo");
    if (logo) {
        logo.addEventListener("click", function (event) {
            event.preventDefault(); // Empêche le comportement par défaut
            location.reload(); // Recharge la page
        });
    }
});

// ✅ Vérifier la connexion Internet avec animation
function checkInternetConnection() {
    const errorDiv = document.getElementById("connection-error");

    if (!navigator.onLine) {
        errorDiv.classList.add("show"); // Afficher avec animation
        errorDiv.classList.remove("d-none");
    } else {
        errorDiv.classList.remove("show"); // Masquer avec animation
        setTimeout(() => errorDiv.classList.add("d-none"), 500);
    }
}


// ✅ Vérifier la connexion au chargement
document.addEventListener("DOMContentLoaded", function () {
    checkInternetConnection(); // Vérifier dès le chargement de la page

    // ✅ Vérifier la connexion en temps réel
    window.addEventListener("offline", checkInternetConnection);
    window.addEventListener("online", checkInternetConnection);
});

document.addEventListener("DOMContentLoaded", function () {
    // ✅ Vider automatiquement le champ URL au chargement
    const videoUrlInput = document.getElementById("videoUrl");
    if (videoUrlInput) {
        videoUrlInput.value = ""; // Vide le champ URL
    }
});
document.addEventListener("DOMContentLoaded", function () {
    const videoUrlInput = document.getElementById("videoUrl");
    const clearUrlBtn = document.getElementById("clearUrl");

    function toggleClearButton() {
        if (videoUrlInput.value.trim() !== "") {
            clearUrlBtn.classList.remove("d-none");
        } else {
            clearUrlBtn.classList.add("d-none");
        }
    }

    // Vérifie immédiatement l'état de la croix au chargement de la page
    toggleClearButton();

    // Écouteur d'événement sur l'entrée pour afficher/cacher la croix
    videoUrlInput.addEventListener("input", toggleClearButton);

    // Clic sur la croix pour réinitialiser le champ
    clearUrlBtn.addEventListener("click", function () {
        videoUrlInput.value = "";
        clearUrlBtn.classList.add("d-none");
        document.getElementById("result").innerHTML = "";
        document.getElementById('error-message').style.display = "none";
    });
}); 
