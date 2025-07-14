import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private ticketRepo: Repository<Ticket>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async createTicket(dto: { title: string; description: string; assignedTo: number }) {
    const tech = await this.userRepo.findOneBy({ id: dto.assignedTo });

    const ticket = this.ticketRepo.create({
      title: dto.title,
      description: dto.description,
      assignedTo: tech,
      status: 'abierto',
    });

    return this.ticketRepo.save(ticket);
  }
}
