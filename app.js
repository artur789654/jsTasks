document.addEventListener("DOMContentLoaded", () => {
  const addContact = document.getElementById("addContact");
  const addName = document.getElementById("addName");
  const addPhoneNumber = document.getElementById("addPhoneNumber");
  const searchInput = document.getElementById("searchInput");
  const contacts = document.getElementById("contacts");

  const getContactsFromStorage = () => {
    const contacts = localStorage.getItem("contacts");
    return contacts ? JSON.parse(contacts) : [];
  };
  const saveContactsToStorage = (contacts) => {
    localStorage.setItem("contacts", JSON.stringify(contacts));
  };

  const renderContacts = () => {
    const сontactsFromStorage = getContactsFromStorage();
    contacts.innerHTML = "";
    const searchValue = searchInput.value.toLowerCase();

    сontactsFromStorage.forEach((contact) => {
      if (
        contact.name.toLowerCase().includes(searchValue) ||
        contact.phone.toString().includes(searchValue)
      ) {
        const li = document.createElement("li");
        const nameSpan = document.createElement("span");
        const phoneSpan = document.createElement("span");
        const editBtn = document.createElement("button");
        const deleteBtn = document.createElement("button");

        nameSpan.textContent = contact.name;
        phoneSpan.textContent = contact.phone;

        nameSpan.classList.add("contact-name");
        phoneSpan.classList.add("contact-phone");

        editBtn.textContent = "Edit";
        editBtn.classList.add("edit-btn");
        editBtn.addEventListener("click", () => editContact(contact.id));

        deleteBtn.textContent = "delete";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.addEventListener("click", () => deleteContact(contact.id));

        li.append(nameSpan, phoneSpan, editBtn, deleteBtn);
        contacts.appendChild(li);
      }
    });
  };

  addContact.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = addName.value.trim();
    const phone = addPhoneNumber.value.trim();

    if (name === "" || phone === "") return;
    const сontactsFromStorage = getContactsFromStorage();

    const newContact = {
      id: new Date().getTime(),
      name,
      phone,
    };

    сontactsFromStorage.push(newContact);
    saveContactsToStorage(сontactsFromStorage);
    renderContacts();
    addName.value = "";
    addPhoneNumber.value = "";
  });

  const editContact = (contactId) => {
    const сontactsFromStorage = getContactsFromStorage();
    const contactIndex = сontactsFromStorage.findIndex(
      (contact) => contact.id === contactId
    );
    const contact = сontactsFromStorage[contactIndex];

    const editNameInput = document.createElement("input");
    const editPhoneInput = document.createElement("input");
    const saveBtn = document.createElement("button");
    const cancelBtn = document.createElement("button");

    editNameInput.type = "text";
    editNameInput.value = contact.name;
    editNameInput.classList.add("edit-input");

    editPhoneInput.type = "number";
    editPhoneInput.value = contact.phone;
    editPhoneInput.classList.add("edit-input");

    saveBtn.textContent = "Save";
    saveBtn.classList.add("save-btn");
    saveBtn.addEventListener("click", () =>
      saveEditedContact(contactId, editNameInput.value, editPhoneInput.value)
    );

    cancelBtn.textContent = "cancel";
    cancelBtn.classList.add("cancel-btn");
    cancelBtn.addEventListener("click", renderContacts);

    const li = contacts.children[contactIndex];
    li.innerHTML = "";
    li.append(editNameInput, editPhoneInput, saveBtn, cancelBtn);
  };

  const saveEditedContact = (id, editNameInput, editPhoneInput) => {
    const сontactsFromStorage = getContactsFromStorage();
    const contactIndex = сontactsFromStorage.findIndex(
      (contact) => contact.id === id
    );

    сontactsFromStorage[contactIndex].name = editNameInput;
    сontactsFromStorage[contactIndex].phone = editPhoneInput;

    saveContactsToStorage(сontactsFromStorage);
    renderContacts();
  };

  const deleteContact = (contactId) => {
    const сontactsFromStorage = getContactsFromStorage();
    const updatedContact = сontactsFromStorage.filter(
      (contact) => contact.id !== contactId
    );

    saveContactsToStorage(updatedContact);
    renderContacts();
  };

  searchInput.addEventListener("input", renderContacts);
  renderContacts();
});
