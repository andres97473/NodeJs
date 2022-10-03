const getMenuFrontEnd = (role = "USER_ROLE") => {
  const menu = [
    {
      titulo: "Compras",
      icono: "mdi mdi-cart-outline",
      submenu: [
        { titulo: "Planes Disponibles", url: "planes" },
        { titulo: "Solicitudes Realizadas", url: "solicitudes" },
        // { titulo: "Mis Clientes", url: "clientes" },
      ],
    },
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
    {
      titulo: "APIs",
      icono: "fa fa-cogs",
      submenu: [
        { titulo: "Ver APIs", url: "apis-mensajes" },
        // { titulo: "Mis Clientes", url: "clientes" },
      ],
    },
  ];

  if (role === "ADMIN_ROLE") {
    menu.push({
      titulo: "Mantenimientos",
      icono: "mdi mdi-folder-lock-open",
      submenu: [
        { titulo: "Usuarios", url: "usuarios" },
        { titulo: "Solicitudes Admin", url: "solicitudes-admin" },
      ],
    });
  }

  return menu;
};

module.exports = {
  getMenuFrontEnd,
};
