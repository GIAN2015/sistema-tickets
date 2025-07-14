// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(dto: { username: string; password: string; role: 'admin' | 'user' | 'ti' }) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = this.usersRepo.create({
      username: dto.username,
      password: hashedPassword,
      role: dto.role,
    });
    return this.usersRepo.save(user);
  }

  async login(dto: { username: string; password: string }) {
    const user = await this.usersRepo.findOne({ where: { username: dto.username } });
    if (!user) throw new Error('Usuario no encontrado');

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) throw new Error('Contraseña incorrecta');

    const payload = { sub: user.id, username: user.username, role: user.role };
    const token = await this.jwtService.signAsync(payload);

    return {   access_token: this.jwtService.sign(payload), };
  }

  async validateUser(id: number) {
    return this.usersRepo.findOne({ where: { id } });
  }
  
}
