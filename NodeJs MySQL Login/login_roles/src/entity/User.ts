import {Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn, UpdateDateColumn } from "typeorm";

import { MinLength, IsNotEmpty } from "class-validator";

import * as bcrypt from "bcryptjs";

// TODO IsEmail

@Entity()
@Unique(['username'])
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @MinLength(4)
    username: string;

    @Column()
    @MinLength(6)
    password: string;

    @Column()
    @IsNotEmpty()
    role: string;

    @Column()
    @CreateDateColumn()
    create_at: Date;

    @Column()
    @UpdateDateColumn()
    update_at: Date; 
    
    // Metodos
    
    // Encriptar password
    hashPassword():void{        
        this.password = bcrypt.hashSync(this.password, 10 );
    }

    checkPassword( password: string ):boolean{
        return bcrypt.compareSync(password,this.password)
    }



}
