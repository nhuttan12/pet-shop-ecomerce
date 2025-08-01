import { AuthController } from '@auth/auth.controller';
import { AuthService } from '@auth/auth.service';
import { JwtStrategy } from '@auth/strategy/jwt.strategy';
import { LocalStrategy } from '@auth/strategy/local.strategy';
import { AppConfigModule } from '@config/app-config.module';
import { AppConfigService } from '@config/app-config.service';
import { ImageModule } from '@images/image.module';
import { MailModule } from '@mail/mail.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { RoleModule } from '@role/role.module';
import { UtilityModule } from '@services/utility.module';
import { UsersModule } from '@user/user.module';

@Module({
  imports: [
    UtilityModule,
    PassportModule,
    ImageModule,
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
