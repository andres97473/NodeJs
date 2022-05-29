import Note from "./models/Note";

export default (io) => {
  io.on("connection", (socket) => {
    const emitNotes = async () => {
      const notes = await Note.find();
      //   console.log(notes);
      io.emit("server:loadnotes", notes);
    };
    emitNotes();

    socket.on("client:newnote", async (data) => {
      // console.log(data);
      // new Note({
      //   title: data.title,
      //   description: data.description
      // });
      // como el objeto q viene de data tiene los mismos campos se puede utilizar solo data
      const newNote = new Note(data);
      const savedNote = await newNote.save();
      // console.log(savedNote);
      // el socket es la coneccion con el cliente asi que solo se actualiza en esa ventana la nueva nota
      // socket.emit("server:newnote", savedNote);

      // io es toda la coneccion por lo que se actualiza la nueva nota a todos los conectados
      io.emit("server:newnote", savedNote);
    });
    socket.on("client:deletenote", async (id) => {
      // console.log(id);
      await Note.findByIdAndDelete(id);
      emitNotes();
    });

    socket.on("client:getnote", async (id) => {
      // console.log(id);
      const note = await Note.findById(id);
      // console.log(note);
      io.emit("server:selectednote", note);
    });

    socket.on("client:updatenote", async (data) => {
      await Note.findByIdAndUpdate(data._id, {
        title: data.title,
        description: data.description,
      });
      emitNotes();
    });
  });
};
