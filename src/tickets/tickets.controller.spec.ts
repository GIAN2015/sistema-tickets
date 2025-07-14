import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('tickets')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  @Roles('admin') // solo admin puede crear tickets
  createTicket(
    @Body() dto: { title: string; description: string; assignedTo: number }
  ) {
    return this.ticketsService.createTicket(dto);
  }
}
