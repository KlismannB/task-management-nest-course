import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  @InjectRepository(User)
  private usersRepository: Repository<User>;

  async createUser(authCredentialsDTO: AuthCredentialsDTO): Promise<void> {
    const { username, password } = authCredentialsDTO;

    // hash
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.usersRepository.create({ username, password: hashedPassword });
    try {
      await this.usersRepository.save(user);
    } catch (error) {
      if (error.code === "23505")
        throw new ConflictException("Username already exists!");
      else
        throw new InternalServerErrorException();
    }
  }

  async signIn(authCredentialsDTO: AuthCredentialsDTO): Promise<string> {
    const { username, password } = authCredentialsDTO;

    const user = await this.usersRepository.findOne({ where: { username } });

    if (user && (await bcrypt.compare(password, user.password))) {
      return 'success';
    } else {
      throw new UnauthorizedException("Please check your login credentials");
    }
  }
}
