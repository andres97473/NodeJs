import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Car {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    manofacturer: string;

    @Column()
    color: string;

    @Column()
    year: number;

    @Column()
    isSold: boolean;
}