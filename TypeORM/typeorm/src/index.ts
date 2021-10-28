import "reflect-metadata";
import {createConnection} from "typeorm";
import {User} from "./entity/User";
import { Car } from './entity/Car';

createConnection().then(async connection => {

    // console.log("Inserting a new user into the database...");
    // const user = new User();
    // user.firstName = "Timber";
    // user.lastName = "Saw";
    // user.age = 25;
    // await connection.manager.save(user);
    // console.log("Saved a new user with id: " + user.id);

    // console.log("Loading users from the database...");
    // const users = await connection.manager.find(User);
    // console.log("Loaded users: ", users);

    // console.log("Here you can setup and run express/koa/any other framework.");

    // carro
    // const car = new Car();
    // car.manofacturer = "Mazda";
    // car.color = "Blue";
    // car.year = 2010;
    // car.isSold = false;

    // connection.manager.save(car).then( (car) => {
    //     console.log('A new car has been created ' + car.id );

    // });


    // user
    // const user = new User();
    // user.username = "admin@gmail.com";
    // user.password = "1234567";
    // user.role = "admin";

    // // hash
    // user.hashPassword();

    // connection.manager.save(user).then( (user) => {
    //     console.log('A new user has been created ' + user.id );

    // });

    // carro
    // const car = new Car();
    // car.manofacturer = "Ford";
    // car.color = "Gray";
    // car.year = 2015;
    // car.isSold = false;

    // const carRepository = await connection.getRepository(Car);
    // const savedCar = await carRepository.save(car);
    // console.log('A new car has been created ' + savedCar.id );

    // buscar todos los carros
    // const carRepository = await connection.getRepository(Car);
    // const allSavedCars = await carRepository.find();
    // console.log('Estos son los carros guardados' ,allSavedCars);

    // buscar el primer carro
    // const carRepository = await connection.getRepository(Car);
    // const firtsCar = await carRepository.findOne(1);
    // console.log('Este es el primer carro guardado' ,firtsCar);

    // buscar el carro Mazda
    // const carRepository = await connection.getRepository(Car);
    // const mazdaCar = await carRepository.findOne( { manofacturer: 'Mazda' } );
    // console.log('Este es el carro mazda ' ,mazdaCar );
    // console.log('La marca es ' ,mazdaCar.manofacturer );


    // crear el repositorio del user
    const userRepository = await connection.getRepository(User);

    // crear usuario andres
    // const user = new User();
    // user.username = "andres@gmail.com";
    // user.password = "1234567";
    // user.role = "admin";
    // user.hashPassword();
    // await userRepository.save(user);

    const usuarios = await userRepository.find()

    if( usuarios.length == 0){
        // console.log('Base de datos vacia');  
        const user = new User();
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
            const user = new User();
            user.username = "admin@gmail.com";
            user.password = "1234567";
            user.role = "admin";
    
            // use hash
            user.hashPassword();
    
            // Save user
            await userRepository.save(user); 
        }
        
    }

    
    
    


}).catch(error => console.log(error));
