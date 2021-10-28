import 'reflect-metadata';
import { createConnection, getRepository } from 'typeorm';
import * as express from 'express';
import * as cors from 'cors';
import * as helmet from 'helmet';
import routes from './routes';
import { Users } from './entity/Users';

const PORT = process.env.PORT || 3000;

createConnection()
  .then(async connection => {

    
    // create express app
    const app = express();
    // Middlewares
    app.use(cors());
    app.use(helmet());

    app.use(express.json());
    // Routes
    app.use('/', routes);

    // start express server
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

    

    // crear el repositorio del user
    const userRepository = await connection.getRepository(Users);

    const usuarios = await userRepository.find()

    if( usuarios.length == 0){
        // console.log('Base de datos vacia');  
        const user = new Users();
        user.username = "admin@gmail.com";
        user.password = "1234567";
        user.role = "admin";

        // use hash
        user.hashPassword();

        // Save user
        await userRepository.save(user);
    } else {
        // console.log('Base de datos tiene datos'); 
        const admin = await userRepository.findOne( { username:'admin@gmail.com' } );
        // console.log(admin);
        if( admin ){
            console.log('admin existe');            
        } else {
            console.log('admin no existe');
            const user = new Users();
            user.username = "admin@gmail.com";
            user.password = "1234567";
            user.role = "admin";
    
            // use hash
            user.hashPassword();
    
            // Save user
            await userRepository.save(user); 
        }
        
    }
    
  })
  .catch(error => console.log(error));