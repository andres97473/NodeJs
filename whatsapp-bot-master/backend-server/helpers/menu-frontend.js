const getMenuFrontEnd = (role = "USER_ROLE") => {
  const menu = [
    {
      titulo: "Dashboard",
      icono: "mdi mdi-gauge",
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
      submenu: [
        { titulo: "Usuarios", url: "usuarios" },
        { titulo: "Hospitales", url: "hospitales" },
        { titulo: "Medicos", url: "medicos" },
      ],
    });
  }

  return menu;
};

module.exports = {
  getMenuFrontEnd,
};
