import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/sign-up')
  public async signUp(
    @Body() authCredentialsDTO: AuthCredentialsDTO,
  ): Promise<void> {
    return this.authService.createUser(authCredentialsDTO);
  }

  @Post('/sign-in')
  public async signIn(
    @Body() authCredentialsDTO: AuthCredentialsDTO,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredentialsDTO);
  }
}
