import { AuthService, JwtPayload } from '@auth';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);
  constructor(
    configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('http.jwtKey'),
    });
  }

  async validate(payload: JwtPayload) {
    this.logger.debug(`Payload info ${JSON.stringify(payload)}`);

    const user: JwtPayload = await this.authService.getUserFromPayload(
      payload.sub,
      payload.username,
    );
    this.logger.debug(`Validate user: ${JSON.stringify(user)}`);

    return user;
  }
}
