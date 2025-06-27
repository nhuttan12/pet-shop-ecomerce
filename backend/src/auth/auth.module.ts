import { AuthController, AuthService, JwtStrategy, LocalStrategy } from '@auth';
import { AppConfigModule, AppConfigService, MailModule } from '@common';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { RoleModule } from '@role';
import { UsersModule } from '@user';

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
