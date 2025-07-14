import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from 'src/tickets/entities/ticket.entity';
import { User } from 'src/tickets/entities/user.entity';

@Injectable()
export class TicketsService {
    constructor(
        @InjectRepository(Ticket)
        private readonly ticketRepository: Repository<Ticket>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async create(dto: any, user: any) {
        const creator = await this.userRepository.findOneBy({ id: user.userId });

        if (!creator) {
            throw new Error('El usuario creador no existe');
        }

        // Validar que el usuario asignado exista y tenga rol 'user'
        const assignedUser = await this.userRepository.findOneBy({ id: dto.assignedTo });

        if (!assignedUser || assignedUser.role !== 'user') {
            throw new Error('Solo se puede asignar tickets a usuarios con rol "user"');
        }

        const ticket = this.ticketRepository.create({
            title: dto.title,
            description: dto.description,
            status: 'pendiente',
            createdBy: creator,
            assignedTo: assignedUser,
        });

        return await this.ticketRepository.save(ticket);
    }


    async findAllByRole(user: any) {
        console.log('Usuario autenticado:', user); // Asegúrate que este sea "carlos"

        if (user.role === 'admin') {
            return this.ticketRepository.find({
                relations: ['createdBy', 'assignedTo'],
            });
        }

        if (user.role === 'user') {
            return this.ticketRepository.find({
                where: { assignedTo: { id: user.userId } },
                relations: ['createdBy', 'assignedTo'],
            });
        }

        if (user.role === 'ti') {
            return this.ticketRepository.find({
                where: { assignedTo: { id: user.userId } },
                relations: ['createdBy', 'assignedTo'],
            });
        }

        return [];
    }


    async updateState(id: number, status: string) {
        const ticket = await this.ticketRepository.findOneBy({ id });
        if (!ticket) throw new Error('Ticket no encontrado');

        ticket.status = status;
        return this.ticketRepository.save(ticket);
    }

    async markAsCompleted(id: number) {
        const ticket = await this.ticketRepository.findOneBy({ id });
        if (!ticket) throw new Error('Ticket no encontrado');

        ticket.status = 'completado';
        return this.ticketRepository.save(ticket);
    }
}
