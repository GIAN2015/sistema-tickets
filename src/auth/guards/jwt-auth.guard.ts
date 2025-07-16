import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info, context) {
    console.log('JwtAuthGuard → handleRequest');
    console.log('Error:', err);
    console.log('User:', user);
    console.log('Info:', info);

    return super.handleRequest(err, user, info, context);
  }
}
