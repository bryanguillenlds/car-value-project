import { User } from './../users/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  price: number;

  @Column()
  make: string;

  @Column()
  model: string;

  @Column()
  year: number;

  @Column()
  lng: number;

  @Column()
  lat: number;

  @Column()
  mileage: number;

  //Decorator so that ReportS can have only ONE User
  //This will add a column to DB to relate to a user id
  @ManyToOne(() => User, (user) => user.reports)
  user: User;
}
