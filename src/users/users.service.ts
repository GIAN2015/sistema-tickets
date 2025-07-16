// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) { }
  findAll() {
    return this.usersRepo.find(); // devuelve todos los usuarios
  }

  async createUser(dto: { username: string; password: string; role: "user" | "admin" | "ti" }) {
    const hashed = await bcrypt.hash(dto.password, 10);
    const user = this.usersRepo.create({ ...dto, password: hashed, role: dto.role as "user" | "admin" | "ti" });
    return this.usersRepo.save(user);
  }
}
