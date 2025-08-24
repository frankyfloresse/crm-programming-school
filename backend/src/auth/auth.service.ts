import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { User } from './entities/user.entity';
import { Token } from './entities/token.entity';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  private generateJti(): string {
    return crypto.randomUUID();
  }

  private calculateExpirationDate(expiresIn: string): Date {
    const now = new Date();
    const match = expiresIn.match(/^(\d+)([smhd])$/);
    if (!match) {
      throw new Error('Invalid expiration format');
    }

    const value = parseInt(match[1]);
    const unit = match[2];

    switch (unit) {
      case 's':
        return new Date(now.getTime() + value * 1000);
      case 'm':
        return new Date(now.getTime() + value * 60 * 1000);
      case 'h':
        return new Date(now.getTime() + value * 60 * 60 * 1000);
      case 'd':
        return new Date(now.getTime() + value * 24 * 60 * 60 * 1000);
      default:
        throw new Error('Invalid time unit');
    }
  }

  private async createTokenPair(user: User): Promise<{
    accessToken: string;
    refreshToken: string;
    accessExpiresAt: Date;
    refreshExpiresAt: Date;
    jti: string;
  }> {
    const jti = this.generateJti();
    const accessTokenExpiresIn = this.configService.get<string>(
      'jwt.accessTokenExpiresIn',
    );
    const refreshTokenExpiresIn = this.configService.get<string>(
      'jwt.refreshTokenExpiresIn',
    );

    const accessExpiresAt = this.calculateExpirationDate(accessTokenExpiresIn);
    const refreshExpiresAt = this.calculateExpirationDate(
      refreshTokenExpiresIn,
    );

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      jti,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: accessTokenExpiresIn,
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: refreshTokenExpiresIn,
    });

    return {
      accessToken,
      refreshToken,
      accessExpiresAt,
      refreshExpiresAt,
      jti,
    };
  }

  private async saveTokenToDatabase(
    user: User,
    tokenData: {
      accessToken: string;
      refreshToken: string;
      accessExpiresAt: Date;
      refreshExpiresAt: Date;
      jti: string;
    },
  ): Promise<Token> {
    const token = this.tokenRepository.create({
      jti: tokenData.jti,
      accessToken: tokenData.accessToken,
      refreshToken: tokenData.refreshToken,
      accessExpiresAt: tokenData.accessExpiresAt,
      refreshExpiresAt: tokenData.refreshExpiresAt,
      userId: user.id,
      user,
    });

    return this.tokenRepository.save(token);
  }


  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    // Find user
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if account is active
    if (!user.is_active) {
      throw new UnauthorizedException('Account is not activated. Please use password recovery to activate your account.');
    }

    // Check password using entity method
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate token pair
    const tokenData = await this.createTokenPair(user);
    await this.saveTokenToDatabase(user, tokenData);

    return {
      accessToken: tokenData.accessToken,
      refreshToken: tokenData.refreshToken,
      accessExpiresAt: tokenData.accessExpiresAt,
      refreshExpiresAt: tokenData.refreshExpiresAt,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  async refreshToken(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<AuthResponseDto> {
    const { refreshToken } = refreshTokenDto;

    try {
      // Verify refresh token
      const payload = this.jwtService.verify(refreshToken);

      // Find token in database
      const tokenRecord = await this.tokenRepository.findOne({
        where: { jti: payload.jti, refreshToken },
        relations: ['user'],
      });

      if (!tokenRecord) {
        throw new UnauthorizedException('Token not found');
      }

      if (tokenRecord.isBlocked) {
        throw new UnauthorizedException('Token is blocked');
      }

      if (tokenRecord.refreshExpiresAt < new Date()) {
        throw new UnauthorizedException('Refresh token expired');
      }

      // Block the old token
      tokenRecord.isBlocked = true;
      await this.tokenRepository.save(tokenRecord);

      // Generate new token pair
      const tokenData = await this.createTokenPair(tokenRecord.user);
      await this.saveTokenToDatabase(tokenRecord.user, tokenData);

      return {
        accessToken: tokenData.accessToken,
        refreshToken: tokenData.refreshToken,
        accessExpiresAt: tokenData.accessExpiresAt,
        refreshExpiresAt: tokenData.refreshExpiresAt,
        user: {
          id: tokenRecord.user.id,
          email: tokenRecord.user.email,
          firstName: tokenRecord.user.firstName,
          lastName: tokenRecord.user.lastName,
          role: tokenRecord.user.role,
        },
      };
    } catch (error) {
      if (
        error.name === 'JsonWebTokenError' ||
        error.name === 'TokenExpiredError'
      ) {
        throw new UnauthorizedException('Invalid or expired refresh token');
      }
      throw error;
    }
  }

  async logout(jti: string): Promise<{ message: string }> {
    const token = await this.tokenRepository.findOne({
      where: { jti },
    });

    if (!token) {
      throw new BadRequestException('Token not found');
    }

    if (token.isBlocked) {
      return { message: 'Token already revoked' };
    }

    // Block the token
    token.isBlocked = true;
    await this.tokenRepository.save(token);

    return { message: 'Successfully logged out' };
  }

  async logoutAll(userId: number): Promise<{ message: string }> {
    await this.tokenRepository.update(
      { userId, isBlocked: false },
      { isBlocked: true },
    );

    return { message: 'Successfully logged out from all devices' };
  }

  async recoveryPassword(userId: number): Promise<{ token: string; }> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User with this ID does not exist');
    }

    // Generate recovery token
    const recoveryToken = crypto.randomBytes(32).toString('hex');
    const recoveryTokenExpiresIn = this.configService.get<string>('jwt.recoveryTokenExpiresIn');
    const recoveryTokenExpiry = this.calculateExpirationDate(recoveryTokenExpiresIn);

    // Save recovery token
    user.recoveryPasswordToken = recoveryToken;
    user.recoveryPasswordExpires = recoveryTokenExpiry;
    await this.userRepository.save(user);

    return { 
      token: recoveryToken,
    };
  }

  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    const { token, newPassword } = resetPasswordDto;

    const user = await this.userRepository.findOne({
      where: {
        recoveryPasswordToken: token,
      },
    });

    if (
      !user ||
      !user.recoveryPasswordExpires ||
      user.recoveryPasswordExpires < new Date()
    ) {
      throw new UnauthorizedException('Invalid or expired recovery token');
    }

    // Update user (password will be hashed automatically by @BeforeUpdate hook)
    user.password = newPassword;
    user.recoveryPasswordToken = null;
    user.recoveryPasswordExpires = null;
    user.is_active = true; // Activate account on first password recovery
    await this.userRepository.save(user);

    // Block all existing tokens for this user
    await this.logoutAll(user.id);

    return { message: 'Password has been reset successfully and account is now activated' };
  }

  async validateUser(payload: any): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: payload.sub },
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }

  async validateToken(payload: any): Promise<{ user: User; token: Token }> {
    const user = await this.userRepository.findOne({
      where: { id: payload.sub },
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const token = await this.tokenRepository.findOne({
      where: { jti: payload.jti },
    });

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    if (token.isBlocked) {
      throw new UnauthorizedException('Token is blocked');
    }

    if (token.accessExpiresAt < new Date()) {
      throw new UnauthorizedException('Token expired');
    }

    return { user, token };
  }
}
