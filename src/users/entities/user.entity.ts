import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Ticket } from 'src/tickets/entities/ticket.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  role: string;

  // Relación: Un usuario técnico puede tener muchos tickets asignados
  @OneToMany(() => Ticket, (ticket) => ticket.assignedTo)
  assignedTickets: Ticket[];

  // Si el admin va a poder ver los tickets que creó (opcional)
  // @OneToMany(() => Ticket, (ticket) => ticket.createdBy)
  // createdTickets: Ticket[];
}
