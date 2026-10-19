
const STORAGE_KEY = "projecthub_projects";

const defaultProjects = [
    {
        id: 1,
        name: "Portfolio Website",
        description: "A personal website to showcase my skills and work.",
        status: "In Progress"
    },
    {
        id: 2,
        name: "Smart Application",
        description: "An application designed to solve everyday problems.",
        status: "Planning"
    },
    {
        id: 3,
        name: "Data Analysis",
        description: "Explore datasets and present useful insights.",
        status: "Completed"
    }
];

let projects;

try {
    const savedProjects = localStorage.getItem(STORAGE_KEY);
    projects = savedProjects === null
        ? defaultProjects
        : JSON.parse(savedProjects);

    if (!Array.isArray(projects)) {
        projects = defaultProjects;
    }
} catch (error) {
    projects = defaultProjects;
}

function saveProjects() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch (error) {
        alert("Could not save projects in this browser.");
    }
}

function renderProjects() {
    const grid = document.getElementById("projectGrid");
    grid.replaceChildren();

    projects.forEach(project => {
        const card = document.createElement("article");
        card.className = "project-card";

        const icon = document.createElement("span");
        icon.className = "project-icon";
        icon.textContent = "📁";

        const heading = document.createElement("h3");
        heading.textContent = project.name;

        const description = document.createElement("p");
        description.textContent = project.description;

        const status = document.createElement("select");
        status.className = "project-status";
        status.setAttribute("aria-label", `Status for ${project.name}`);

        ["Planning", "In Progress", "Completed"].forEach(optionText => {
            const option = document.createElement("option");
            option.value = optionText;
            option.textContent = optionText;
            status.appendChild(option);
        });

        status.value = project.status;
        status.addEventListener("change", () => {
            project.status = status.value;
            saveProjects();
            renderProjects();
        });

        const actions = document.createElement("div");
        actions.className = "project-actions";

        const editButton = document.createElement("button");
        editButton.className = "btn";
        editButton.textContent = "Edit";
        editButton.addEventListener("click", () => editProject(project.id));

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => deleteProject(project.id));

        actions.append(editButton, deleteButton);
        card.append(icon, heading, description, status, actions);
        grid.appendChild(card);
    });
}

function addProject() {
    const name = prompt("Enter your project name:");

    if (!name || !name.trim()) return;

    const description = prompt("Enter a short description:") || "No description added.";

    const newProject = {
        id: Date.now(),
        name: name.trim(),
        description: description.trim(),
        status: "Planning"
    };

    projects.push(newProject);
    saveProjects();
    renderProjects();
}

function editProject(id) {
    const project = projects.find(item => item.id === id);
    if (!project) return;

    const name = prompt("Edit project name:", project.name);
    if (name === null || !name.trim()) return;

    const description = prompt("Edit project description:", project.description);
    if (description === null) return;

    project.name = name.trim();
    project.description = description.trim() || "No description added.";

    saveProjects();
    renderProjects();
}

function deleteProject(id) {
    const project = projects.find(item => item.id === id);
    if (!project) return;

    if (!confirm(`Are you sure you want to delete "${project.name}"?`)) {
        return;
    }

    projects = projects.filter(item => item.id !== id);
    saveProjects();
    renderProjects();
}

renderProjects();
