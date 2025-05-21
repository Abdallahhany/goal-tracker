import { Controller, Post, Body, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { NormalizeEmailPipe } from '../common/pipes/normalize-email.pipe';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Register a new user
  @Post('register')
  @UsePipes(new NormalizeEmailPipe()) 
  async register(@Body() createUserDto: CreateUserDto) {
    // extract email and password from the DTO
    const { email, password } = createUserDto;
    return this.authService.register(email, password);
  }

  // Login a user
  @Post('login')
  @UsePipes(new NormalizeEmailPipe())
  async login(@Body() userData: LoginDto) {
    const { email, password } = userData;
    return this.authService.login(email, password);
  }
}
