// File: modals.js
document.addEventListener("DOMContentLoaded", () => {
    // Store modal instances
    const modalInstances = new Map();
    const navLinks = document.querySelector(".nav-links");
    const saveBtn = document.getElementById("saveBtn");
    const logoutBtn = document.getElementById("logoutBtn");
    const userAccounts = JSON.parse(localStorage.getItem("userAccounts")) || {};
    const loggedInUser = localStorage.getItem("loggedInUser");

  // Only showing the modified injectModalStyles function - rest of the code remains the same

const injectModalStyles = () => {
    const saveCar = (carDetails, button) => {
        const savedCars = JSON.parse(localStorage.getItem("savedCars")) || [];
        if (savedCars.some((car) => car.name === carDetails.name)) {
            alert("Car already saved!");
            return;
        }
        savedCars.push(carDetails);
        localStorage.setItem("savedCars", JSON.stringify(savedCars));
        alert("Car saved successfully!");
        if (button) {
            button.textContent = "Saved";
            button.style.backgroundColor = "#ffcc80";
            button.style.cursor = "not-allowed";
            button.disabled = true;
        }
    };    
    const styleSheet = document.createElement("style");
    styleSheet.textContent = `
        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100% !important;
            height: 100% !important;
            background-color: rgba(0, 0, 0, 0.8) !important;
            z-index: 1000;
            justify-content: center;
            align-items: center;
            margin: 0 !important;
            padding: 0 !important;
            font-family: Arial, sans-serif !important;
        }

        .modal.active {
            display: flex !important;
        }

        .modal-content {
            background-color: #1a1a1a !important;
            color: #f39c12 !important;
            padding: 25px !important;
            border-radius: 8px !important;
            max-width: 500px !important;
            width: 90% !important;
            position: relative !important;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.5) !important;
            border: 1px solid #f39c12 !important;
            margin: 20px !important;
        }

        .modal-content h2 {
            color: #f39c12 !important;
            margin-bottom: 20px !important;
            font-size: 24px !important;
            text-align: center !important;
            font-weight: bold !important;
        }

        .modal input, 
        .modal select {
            width: calc(100% - 20px) !important;
            padding: 10px !important;
            margin: 10px 0 !important;
            border: 1px solid #f39c12 !important;
            border-radius: 4px !important;
            background-color: #2d2d2d !important;
            color: #ffffff !important;
            font-size: 14px !important;
            outline: none !important;
        }

        .modal input:focus,
        .modal select:focus {
            border-color: #ff9f00 !important;
            box-shadow: 0 0 5px rgba(243, 156, 18, 0.5) !important;
        }

        .modal input::placeholder {
            color: #888888 !important;
        }

        .modal select {
            cursor: pointer !important;
        }

        .modal select option {
            background-color: #2d2d2d !important;
            color: #ffffff !important;
        }

        .modal label {
            color: #f39c12 !important;
            display: block !important;
            margin: 10px 0 5px !important;
            font-size: 14px !important;
        }

        .modal-footer {
            margin-top: 25px !important;
            text-align: right !important;
            display: flex !important;
            justify-content: flex-end !important;
            gap: 10px !important;
        }

        .modal-footer button {
            padding: 10px 20px !important;
            border: none !important;
            border-radius: 4px !important;
            cursor: pointer !important;
            font-size: 14px !important;
            font-weight: bold !important;
            transition: background-color 0.3s, transform 0.1s !important;
        }

        .modal-footer button:first-child {
            background-color: #f39c12 !important;
            color: white !important;
        }

        .modal-footer button:last-child {
            background-color: #2d2d2d !important;
            color: #f39c12 !important;
            border: 1px solid #f39c12 !important;
        }

        .modal-footer button:hover {
            opacity: 0.9 !important;
            transform: translateY(-1px) !important;
        }

        .modal-footer button:active {
            transform: translateY(0) !important;
        }

        #forgot-password-link {
            color: #f39c12 !important;
            cursor: pointer !important;
            text-decoration: underline !important;
            font-size: 14px !important;
            margin: 10px 0 !important;
            display: inline-block !important;
        }

        #forgot-password-link:hover {
            color: #ff9f00 !important;
        }

        #security-question-label {
            color: #f39c12 !important;
            font-weight: bold !important;
            margin: 15px 0 10px !important;
            display: block !important;
        }

        .nav-links a.auth-link {
            color: #f39c12 !important;
            cursor: pointer !important;
            text-decoration: none !important;
            margin-left: 15px !important;
            font-weight: bold !important;
            transition: color 0.3s !important;
        }

        .nav-links a.auth-link:hover {
            color: #ff9f00 !important;
            text-decoration: underline !important;
        }
    `;
    document.head.appendChild(styleSheet);
};

    const saveAccounts = () => {
        localStorage.setItem("userAccounts", JSON.stringify(userAccounts));
    };

    const isLoggedIn = () => !!localStorage.getItem("loggedInUser");

    const setLoggedInUser = (username) => {
        localStorage.setItem("loggedInUser", username);
    };

    const clearLoggedInUser = () => {
        localStorage.removeItem("loggedInUser");
    };

    const resetModalFields = (modalId) => {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        modal.querySelectorAll("input").forEach((input) => (input.value = ""));
        const passwordField = modal.querySelector("#login-password");
        const securityPrompt = modal.querySelector("#security-question-prompt");
        
        if (passwordField) passwordField.style.display = "block";
        if (securityPrompt) securityPrompt.style.display = "none";
    };

    const closeModal = (id) => {
        const modal = document.getElementById(id);
        if (modal) {
            modal.classList.remove("active");
            resetModalFields(id);
        }
    };

    const createModal = (id, title, content, footer) => {
        // Remove existing modal if it exists
        const existingModal = document.getElementById(id);
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement("div");
        modal.className = "modal";
        modal.id = id;
        modal.innerHTML = `
            <div class="modal-content">
                <h2>${title}</h2>
                <div class="modal-body">${content}</div>
                <div class="modal-footer">${footer || ""}</div>
            </div>
        `;

        // Event delegation for modal clicks
        modal.addEventListener("click", (e) => {
            // Close if clicking outside modal content
            if (e.target === modal) {
                closeModal(id);
            }
        });

        document.body.appendChild(modal);
        modalInstances.set(id, modal);
        return modal;
    };

    const showModal = (id) => {
        resetModalFields(id);
        modalInstances.forEach((modal, modalId) => {
            if (modalId !== id) {
                modal.classList.remove("active");
            }
        });

        const modal = document.getElementById(id);
        if (modal) {
            modal.classList.add("active");
        }
    };

    const addAuthLinks = () => {
        // Remove existing auth links if they exist
        document.querySelectorAll('.auth-link').forEach(link => link.remove());

        // Create and add Sign Up link
        const signupLink = document.createElement("a");
        signupLink.textContent = "Sign Up";
        signupLink.className = "auth-link";
        signupLink.href = "#";
        signupLink.addEventListener("click", (e) => {
            e.preventDefault();
            showModal("signup-modal");
        });

        // Create and add Login link
        const loginLink = document.createElement("a");
        loginLink.textContent = "Login";
        loginLink.className = "auth-link";
        loginLink.href = "#";
        loginLink.addEventListener("click", (e) => {
            e.preventDefault();
            showModal("login-modal");
        });

        // Add links to navigation
        navLinks.appendChild(signupLink);
        navLinks.appendChild(loginLink);
    };

    const userLoggedIn = (username) => {
        // Remove auth links
        document.querySelectorAll('.auth-link').forEach(link => link.remove());
        
        // Show save and logout buttons
        if (saveBtn) saveBtn.style.display = "inline";
        if (logoutBtn) {
            logoutBtn.style.display = "inline";
            // Add logout event listener if not already added
            if (!logoutBtn.hasListener) {
                logoutBtn.addEventListener("click", (e) => {
                    e.preventDefault();
                    userLoggedOut();
                });
                logoutBtn.hasListener = true;
            }
        }
    };

    const userLoggedOut = () => {
        // Hide save and logout buttons
        if (saveBtn) saveBtn.style.display = "none";
        if (logoutBtn) logoutBtn.style.display = "none";
        
        // Add auth links back
        addAuthLinks();
        
        clearLoggedInUser();
        resetModalFields("login-modal");
        resetModalFields("signup-modal");
        
        alert("Logged out successfully.");
    };

    // Initialize auth state
    const initializeAuthState = () => {
        if (loggedInUser) {
            userLoggedIn(loggedInUser);
        } else {
            addAuthLinks();
        }
    };

    // Create modals with proper event handling for cancel buttons
    createModal(
        "signup-modal",
        "Sign Up",
        `
            <input type="text" id="signup-username" placeholder="Username" required>
            <input type="password" id="signup-password" placeholder="Password" required>
            <label for="security-question">Choose a Security Question:</label>
            <select id="security-question">
                <option>What is your favourite Car?</option>
                <option>What is your favourite Animal?</option>
                <option>What is your favourite Dog?</option>
                <option>What is your favourite Cat?</option>
                <option>What is your favourite Book?</option>
                <option>What is your favourite Show?</option>
                <option>What is your favourite Movie?</option>
                <option>What is your favourite Game?</option>
                <option>What is your favourite Place?</option>
                <option>What is your favourite Person?</option>
            </select>
            <input type="text" id="security-answer" placeholder="Answer to security question" required>
        `,
        `<button id="signup-submit">Sign Up</button>
         <button class="cancel-button" data-modal="signup-modal">Cancel</button>`
    );

    createModal(
        "login-modal",
        "Log In",
        `
            <input type="text" id="login-username" placeholder="Username" required>
            <input type="password" id="login-password" placeholder="Password" required>
            <p id="forgot-password-link" style="color: #f39c12; cursor: pointer;">Forgot Password?</p>
            <div id="security-question-prompt" style="display:none;">
                <label id="security-question-label" style="color: #f39c12;"></label>
                <input type="text" id="security-answer-login" placeholder="Answer to security question" required>
            </div>
        `,
        `<button id="login-submit">Log In</button>
         <button class="cancel-button" data-modal="login-modal">Cancel</button>`
    );

    // Add event listeners for modal buttons
    document.getElementById("signup-submit").addEventListener("click", () => {
        const username = document.getElementById("signup-username").value;
        const password = document.getElementById("signup-password").value;
        const question = document.getElementById("security-question").value;
        const answer = document.getElementById("security-answer").value;

        if (!username || !password || !answer) {
            alert("All fields are required.");
            return;
        }

        if (userAccounts[username]) {
            alert("Username already exists. Choose a different username.");
            return;
        }

        userAccounts[username] = { password, question, answer };
        saveAccounts();
        setLoggedInUser(username);
        closeModal("signup-modal");
        userLoggedIn(username);
        alert("Account created successfully. You are now logged in.");
    });

    document.getElementById("login-submit").addEventListener("click", () => {
        const username = document.getElementById("login-username").value;
        const password = document.getElementById("login-password").value;
        const securityPromptVisible = document.getElementById("security-question-prompt").style.display !== "none";

        if (!username || (!password && !securityPromptVisible)) {
            alert("All fields are required.");
            return;
        }

        const user = userAccounts[username];
        if (!user) {
            alert("Account does not exist.");
            return;
        }

        if (securityPromptVisible) {
            const answer = document.getElementById("security-answer-login").value;
            if (user.answer === answer) {
                setLoggedInUser(username);
                closeModal("login-modal");
                userLoggedIn(username);
                alert("Logged in successfully.");
            } else {
                alert("Incorrect answer.");
            }
        } else if (user.password === password) {
            setLoggedInUser(username);
            closeModal("login-modal");
            userLoggedIn(username);
            alert("Logged in successfully.");
        } else {
            alert("Incorrect password.");
        }
    });

    document.getElementById("forgot-password-link").addEventListener("click", () => {
        const username = document.getElementById("login-username").value;
        const user = userAccounts[username];

        if (!user) {
            alert("Enter a valid username first.");
            return;
        }

        const words = user.question.split(" ");
        words[words.length - 1] = "_____";
        const obscuredQuestion = words.join(" ");

        document.getElementById("security-question-label").textContent = `Answer to: ${obscuredQuestion}`;
        document.getElementById("security-question-prompt").style.display = "block";
        document.getElementById("login-password").style.display = "none";
    });

    // Event delegation for cancel buttons
    document.body.addEventListener("click", (e) => {
        if (e.target.classList.contains("cancel-button")) {
            const modalId = e.target.dataset.modal;
            if (modalId) {
                closeModal(modalId);
            }
        }
    });

    // Initialize
    injectModalStyles();
    initializeAuthState();
});
saveCar(carDetails, button);
const attachSaveButtonListeners = () => {
    document.querySelectorAll(".save-button").forEach((button) => {
        button.addEventListener("click", (event) => {
            const carCard = event.target.closest(".car-card");
            const carDetails = {
                name: carCard.querySelector(".car-name").textContent.trim(),
                price: carCard.querySelector(".car-detail strong").textContent.trim(),
                engineType: carCard.querySelector(".car-detail:last-child").textContent.trim(),
                image: carCard.querySelector(".car-image").src,
            };
            if (!isLoggedIn()) {
                alert("You need to be logged in to save a car.");
                return;
            }
            saveCar(carDetails, button);
        });
    });
};
const displaySavedCars = () => {
    const savedCars = JSON.parse(localStorage.getItem("savedCars")) || [];
    const savedCarsContainer = document.querySelector(".saved-cars-container");

    // Clear previous content in the container
    savedCarsContainer.innerHTML = "";

    // Show message if no saved cars are found
    if (!savedCars.length) {
        savedCarsContainer.innerHTML = '<p>No saved cars found.</p>';
        return;
    }

    // Render saved cars if they exist
    savedCars.forEach((car) => {
        const carCard = document.createElement("div");
        carCard.className = "car-card";
        carCard.innerHTML = `
            <img src="${car.image}" alt="${car.name}" class="car-image" />
            <h2 class="car-name">${car.name}</h2>
            <p class="car-detail"><strong>Lowest Price:</strong> ${car.price}</p>
            <p class="car-detail"><strong>Engine Type:</strong> ${car.engineType}</p>
        `;
        savedCarsContainer.appendChild(carCard);
    });
};
document.addEventListener("DOMContentLoaded", () => {
    // Ensure this runs only on save.html
    if (window.location.pathname.includes("save.html")) {
        displaySavedCars();
    }
});
