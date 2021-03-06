import { collection, deleteDoc, doc, getFirestore, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

const database = getFirestore();

let users = [];

const tableUsers = document.querySelector("table#table-users tbody");

const modalUsersCreate = new bootstrap.Modal(document.getElementById('modal-users-create'), {});
const formUsersCreate = document.querySelector("#modal-users-create #form-users-create");

const modalUsersUpdate = new bootstrap.Modal(document.querySelector("#modal-users-update"), {});
const formUsersUpdate = document.querySelector("#form-users-update");

function renderUsers() {

    tableUsers.innerHTML = '';

    users.forEach(async function(item) {

        const tableRow = document.createElement("tr");
    
        tableRow.innerHTML = `
            <td>
                <div class="d-flex px-2 py-1">
                    <div>
                        <img src="${item.photo ? "./assets/img/" + item.photo : "./assets/img/tesla-model-s.png"}" class="avatar avatar-sm me-3 border-radius-lg" alt="${item.name}">
                    </div>
                    <div class="d-flex flex-column justify-content-center">
                        <h6 class="mb-0 text-sm">${item.name}</h6>
                        <p class="text-xs text-secondary mb-0">${item.email}</p>
                    </div>
                </div>
            </td>
            <td>
                <p class="text-xs font-weight-bold mb-0">${item.job}</p>
                <p class="text-xs text-secondary mb-0">${item.department}</p>
            </td>
            <td class="align-middle text-center text-sm">
                <span class="badge badge-sm ${(item.status === "1") ? "bg-gradient-success" : "bg-gradient-secondary"}">${item.status === "1" ? "Online" : "Offline"}</span>
            </td>
            <td class="align-middle text-center">
                <span class="text-secondary text-xs font-weight-bold">${await item.register.toDate().toLocaleDateString("pt-BR")}</span>
            </td>
            <td class="flex-td">
                <a class="nav-link text-secondary button-edit" href="#" title="Editar">
                    <div class="text-center me-2 d-flex align-items-center justify-content-center">
                        <i class="material-icons opacity-10">edit</i>
                    </div>
                </a>
                <a class="nav-link button-delete" href="#" title="Excluir">
                    <div class="text-center me-2 d-flex align-items-center justify-content-center">
                        <i class="material-icons opacity-10">delete</i>
                    </div>
                </a>
            </td>
        `;

        tableRow.querySelector(".button-edit").addEventListener("click", (e) => {

            e.preventDefault();

            // for in
            for (let prop in item) {

                const input = formUsersUpdate.querySelector(`[name=${prop}]`);

                if (input) {

                    if (input.type === "radio") {

                        formUsersUpdate.querySelector(`[name=${prop}][value="${item[prop]}"]`).click();

                    } else {
                        input.value = item[prop];
                    }

                }

            }

            modalUsersUpdate.show();

        });
    
        tableRow.querySelector(".button-delete").addEventListener("click", async (event) => {
    
            event.preventDefault();
    
            if (confirm(`Deseja realmente excluir o usu??rio ${item.name}?`)) {

                await deleteDoc(doc(database, "users", item.id));

                tableRow.remove();

            }
    
        });
    
        tableUsers.appendChild(tableRow);
    
    });

}

onSnapshot(collection(database, "users"), (data) => {

    users = [];

    data.forEach(document => {        
        const object = {
            ...document.data(),
            id: document.id,
        };
        users.push(object);
    });

    renderUsers();

});

formUsersCreate.addEventListener("submit", async (event) => {

    event.preventDefault();

    const formData = new FormData(formUsersCreate);

    if (!formData.get("name")) {
        console.error("O nome ?? obrigat??rio.");
        return false;
    }

    if (!formData.get("email")) {
        console.error("O email ?? obrigat??rio.");
        return false;
    }

    if (!formData.get("job")) {
        console.error("O cargo ?? obrigat??rio.");
        return false;
    }

    if (!formData.get("department")) {
        console.error("O departamento ?? obrigat??rio.");
        return false;
    }

    if (!formData.get("status")) {
        console.error("O status ?? obrigat??rio.");
        return false;
    }

    await setDoc(doc(database, "users", uuidv4()), {
        name: formData.get("name"),
        email: formData.get("email"),
        job: formData.get("job"),
        department: formData.get("department"),
        status: formData.get("status"),
        photo: formData.get("photo"),
        register: new Date(),
    });

    console.log("Usu??rio criado!");
    
    modalUsersCreate.hide();

});

formUsersUpdate.addEventListener("submit", async (e) => {

    e.preventDefault();

    const formData = new FormData(formUsersUpdate);

    await updateDoc(doc(database, "users", formData.get("id")), {
        name: formData.get("name"),
        email: formData.get("email"),
        job: formData.get("job"),
        department: formData.get("department"),
        status: formData.get("status"),
        photo: formData.get("photo"),
    });

    modalUsersUpdate.hide();

});