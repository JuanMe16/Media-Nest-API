import { User } from "src/auth/auth.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Media {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.id)
    user: User;

    @Column()
    type: string;

    @Column()
    filename: string;

    @Column()
    path: string;
}