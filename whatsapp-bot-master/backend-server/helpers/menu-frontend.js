const getMenuFrontEnd = (role = "USER_ROLE") => {
  const menu = [
    {
      titulo: "MensajesApp",
      icono: "mdi mdi-message-text-outline",
      submenu: [
        { titulo: "Main", url: "/" },
        { titulo: "Graficas", url: "grafica1" },
        { titulo: "ProgressBar", url: "progress" },
        { titulo: "Promesas", url: "promesas" },
        { titulo: "Rxjs", url: "rxjs" },
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
