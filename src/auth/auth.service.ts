import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminUserEntity } from 'src/adminUser/adminUser.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyDto } from './dto/verify.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AdminUserEntity)
    private userRepository: Repository<AdminUserEntity>,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { firstName, lastName, email, password } = registerDto;

    // Check if email exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification code
    const verificationCode = randomBytes(4).toString('hex').toUpperCase();

    // Create user
    const user = this.userRepository.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      verificationCode,
      emailVerified: false,
    });
    await this.userRepository.save(user);

    // Send verification email
    await this.mailerService.sendMail({
      to: email,
      subject: 'Verify Your Email',
      template: './verification',
      context: { code: verificationCode },
    });

    return { message: 'User registered. Please verify your email.' };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.emailVerified) {
      throw new UnauthorizedException('Please verify your email');
    }

    const payload = { sub: user.admin_id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async verifyEmail(verifyDto: VerifyDto) {
    const { email, code } = verifyDto;
    const user = await this.userRepository.findOne({
      where: { email, verificationCode: code },
    });

    if (!user) {
      throw new BadRequestException('Invalid verification code');
    }

    await this.userRepository.update(
      { email },
      { emailVerified: true, verificationCode: undefined },
    );

    const payload = { sub: user.admin_id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
      message: 'Email verified successfully',
    };
  }

  async resendVerificationCode(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    if (user.emailVerified) {
      throw new BadRequestException('Email already verified');
    }

    const verificationCode = randomBytes(4).toString('hex').toUpperCase();
    await this.userRepository.update({ email }, { verificationCode });

    await this.mailerService.sendMail({
      to: email,
      subject: 'Verify Your Email',
      template: './verification',
      context: { code: verificationCode },
    });

    return { message: 'Verification code resent' };
  }
}
