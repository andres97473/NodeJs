import { loadNotes, onNewNote, onSelected } from "./socket.js";
import { onHandleSubmit, renderNotes, appendNote } from "./ui.js";

onNewNote(appendNote);
loadNotes(renderNotes);
onSelected();

const noteForm = document.querySelector("#noteForm");

noteForm.addEventListener("submit", onHandleSubmit);
