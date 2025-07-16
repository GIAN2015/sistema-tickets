import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class TicketsService {
    constructor(
        @InjectRepository(Ticket)
        private ticketRepository: Repository<Ticket>,
    ) { }

    async findAllByRole(user: any) {
        if (user.role === 'admin') {
            return this.ticketRepository.find({
                relations: ['createdBy', 'assignedTo'],
                order: { updatedAt: 'DESC' },
            });
        }

        if (user.role === 'user') {
            const tickets = await this.ticketRepository.find({
                where: { assignedTo: { id: user.userId } },
                relations: ['createdBy', 'assignedTo'],
                order: { updatedAt: 'DESC' },
            });

            return tickets.filter(ticket => ticket.status !== 'cerrado');
        }

        if (user.role === 'ti') {
            // TI ve todos los tickets
            return this.ticketRepository.find({
                relations: ['createdBy', 'assignedTo'],
                order: { updatedAt: 'DESC' },
            });
        }

        return [];
    }
    async findCompletedByUser(userId: number) {
        return this.ticketRepository.find({
            where: {
                assignedTo: { id: userId },
                status: 'cerrado',
            },
            order: { updatedAt: 'DESC' },
            relations: ['createdBy', 'assignedTo'],
        });
    }



    async create(dto: any, createdBy: User) {
        const ticket = this.ticketRepository.create({
            title: dto.title,
            status: 'no iniciado',
            assignedTo: { id: dto.assignedToId },
            createdBy,
            updatedAt: new Date(),
        });

        return this.ticketRepository.save(ticket);
    }


    async updateState(id: number, newStatus: string) {
        const ticket = await this.ticketRepository.findOne({
            where: { id },
            relations: ['assignedTo', 'createdBy'],
        });
        if (!ticket) throw new Error('Ticket no encontrado');

        // Si el usuario marca como "completado", en realidad se pone en "en revisión"
        if (newStatus === 'completado') {
            ticket.status = 'en revisión';
        } else {
            ticket.status = newStatus;
        }

        ticket.updatedAt = new Date();

        return this.ticketRepository.save(ticket);
    }


    async markAsCompleted(id: number) {
        const ticket = await this.ticketRepository.findOne({ where: { id } });
        if (!ticket) throw new Error('Ticket no encontrado');

        ticket.status = 'cerrado';
        ticket.updatedAt = new Date();

        return this.ticketRepository.save(ticket);
    }

    async devolverAlUsuario(id: number) {
        const ticket = await this.ticketRepository.findOne({ where: { id } });
        if (!ticket) throw new Error('Ticket no encontrado');

        ticket.status = 'no iniciado';
        ticket.updatedAt = new Date();

        return this.ticketRepository.save(ticket);
    }


}
