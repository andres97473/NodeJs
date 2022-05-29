import { saveNote, deleteNote, getNoteById, updateNote } from "./socket.js";

const notesList = document.querySelector("#notes");
const title = document.querySelector("#title");
const description = document.querySelector("#description");

let saveId = "";

const noteUI = (note) => {
  const div = document.createElement("div");
  div.innerHTML = /*html*/ `
    <div>
      <h1>${note.title}</h1>
      <div>
        <button class="delete" data-id = ${note._id}>Delete</button>
        <button class="update" data-id = ${note._id} >Update</button>
      </div>
      <p>${note.description}</p>
    </div>
  `;

  const btnDelete = div.querySelector(".delete");
  const btnUpdate = div.querySelector(".update");
  // console.log(btnDelete);
  btnDelete.addEventListener("click", (e) => {
    deleteNote(btnDelete.dataset.id);
  });
  btnUpdate.addEventListener("click", (e) => {
    deleteNote(getNoteById(btnUpdate.dataset.id));
  });

  return div;
};

export const renderNotes = (notes) => {
  // console.log(notes);
  notesList.innerHTML = "";
  notes.forEach((note) => {
    notesList.append(noteUI(note));
  });
};

export const fillForm = (note) => {
  title.value = note.title;
  description.value = note.description;
  saveId = note._id;
};

export const onHandleSubmit = (e) => {
  e.preventDefault();
  //   console.log(noteForm["title"].value, noteForm["description"].value);
  if (saveId) {
    updateNote(saveId, title.value, description.value);
  } else {
    saveNote(title.value, description.value);
  }

  saveId = "";
  title.value = "";
  description.value = "";
};

export const appendNote = (note) => {
  notesList.append(noteUI(note));
};
