const getMenuFrontEnd = (role = "USER_ROLE") => {
  const menu = [
    {
      titulo: "MensajesApp",
      icono: "mdi mdi-message-text-outline",
      submenu: [
        { titulo: "Prueba de envio", url: "mensajes-prueba" },
        { titulo: "Envio de Mensajes", url: "mensajes-envio" },
        { titulo: "Envio de Archivo", url: "mensajes-archivo" },
        { titulo: "Mensajes Enviados", url: "enviados" },
        // { titulo: "Mis Clientes", url: "clientes" },
      ],
    },
  ];

  if (role === "ADMIN_ROLE") {
    menu.push({
      titulo: "Mantenimientos",
      icono: "mdi mdi-folder-lock-open",
      submenu: [{ titulo: "Usuarios", url: "usuarios" }],
    });
  }

  return menu;
};

module.exports = {
  getMenuFrontEnd,
};
