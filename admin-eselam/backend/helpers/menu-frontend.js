const getMenuFrontEnd = (role = "USER_ROLE") => {
  const menu = [
    {
      titulo: "Correspondencia",
      icono: "mdi mdi-folder-multiple-outline",
      submenu: [
        { titulo: "Unidad de Correspondencia", url: "correspondencia" },
        // { titulo: "Mis Clientes", url: "clientes" },
      ],
    },
  ];

  if (role === "ADMIN_ROLE") {
    menu.push({
      titulo: "Administracion",
      icono: "mdi mdi-folder-lock-open",
      submenu: [{ titulo: "Usuarios", url: "usuarios" }],
    });
  }

  return menu;
};

module.exports = {
  getMenuFrontEnd,
};
