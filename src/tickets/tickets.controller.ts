// src/tickets/tickets.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get('mis-tickets')
  @Roles('user')
  getMyTickets(@Request() req) {
    return this.ticketsService.findAllByRole(req.user);
  }

  @Post()
  @Roles('admin')
  create(@Body() dto: any, @Request() req: any) {
    return this.ticketsService.create(dto, req.user);
  }

  @Get()
  @Roles('admin', 'user', 'ti')
  findAll(@Request() req) {
    return this.ticketsService.findAllByRole(req.user);
  }

  @Patch(':id/state')
  @Roles('user', 'ti')
  updateState(@Param('id') id: number, @Body('status') status: string) {
    return this.ticketsService.updateState(id, status);
  }

  @Patch(':id/complete')
  @Roles('ti')
  complete(@Param('id') id: number) {
    return this.ticketsService.markAsCompleted(id);
  }
}
