import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles('admin')
  createUser(
    @Body() dto: { username: string; password: string; role: 'admin' | 'user' | 'ti' }
  ) {
    return this.usersService.createUser(dto);
  }

  // ✅ Nuevo endpoint para obtener la lista de usuarios
  @Get()
  @Roles('admin') // solo admins pueden ver usuarios
  findAll() {
    return this.usersService.findAll();
  }
}
