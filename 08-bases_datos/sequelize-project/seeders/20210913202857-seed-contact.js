'use strict';

module.exports = {
    up: async(queryInterface, Sequelize) => {

        await queryInterface.bulkInsert('Contacts', [{
                firstname: 'Pedro',
                lastname: 'Perez',
                phone: '3207773322',
                email: 'pedro@email.com',
                createdAt: new Date().toDateString(),
                updatedAt: new Date().toDateString()
            },
            {
                firstname: 'Juan',
                lastname: 'Jimenez',
                phone: '3207773311',
                email: 'juan@email.com',
                createdAt: new Date().toDateString(),
                updatedAt: new Date().toDateString()
            }
        ], {});

    },

    down: async(queryInterface, Sequelize) => {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
    }
};