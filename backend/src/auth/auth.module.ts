import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AppConfigModule } from '@helper-modules/config/app-config.module';
import { AppConfigService } from '@helper-modules/config/app-config.service';
import { AuthController } from '@core-modules/auth/auth.controller';
import { AuthService } from '@core-modules/auth/auth.service';
import { JwtStrategy } from '@core-modules/auth/strategy/jwt.strategy';
import { LocalStrategy } from '@core-modules/auth/strategy/local.strategy';
import { RoleModule } from '@core-modules/role/role.module';
import { UsersModule } from '@core-modules/user/user.module';
import { MailModule } from '@helper-modules/mail/mail.module';

@Module({
  imports: [
    PassportModule,
    AppConfigModule,
    UsersModule,
    RoleModule,
    AppConfigModule,
    MailModule,
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
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
