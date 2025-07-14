import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from 'src/tickets/entities/user.entity';

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: string;

  @ManyToOne(() => User, (user) => user.createdTickets)
  createdBy: User;

  @ManyToOne(() => User, (user) => user.assignedTickets, { nullable: true })
  assignedTo: User;  // <-- ESTA LÍNEA DEBE TENER `{ nullable: true }`
}
