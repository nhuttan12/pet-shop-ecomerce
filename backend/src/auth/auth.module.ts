import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AppConfigModule } from 'src/config/app-config.module';
import { AppConfigService } from 'src/config/app-config.service';
import { RoleModule } from 'src/role/role.module';
import { StatusModule } from 'src/status/status.module';
import { UsersModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { LocalStrategy } from './strategy/local.strategy';

@Module({
  providers: [AuthService, LocalStrategy, JwtStrategy],
  imports: [
    PassportModule,
    AppConfigModule,
    UsersModule,
    StatusModule,
    RoleModule,
    JwtModule.registerAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (appConfigService: AppConfigService) => ({
        secret: appConfigService.jwtKey,
        signOptions: {
          expiresIn: appConfigService.expireTime,
        },
      }),
    }),
  ],
  controllers: [AuthController],
})
export class AuthModule {}
