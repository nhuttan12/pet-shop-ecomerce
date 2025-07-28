import { AuthService } from '@auth/auth.service';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtPayload } from '@auth/interfaces/jwt-payload.interface';
import { AuthMessageLog } from '@auth/messages/auth.messages-log';
import { AuthErrorMessages } from '@auth/messages/auth.error-messages';
import { UtilityService } from '@services/utility.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);
  constructor(
    private readonly utilityService: UtilityService,
    configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    const jwtKey = configService.get<string>('http.jwtKey');
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtKey,
    });
    this.utilityService.logPretty('Jwt key:', jwtKey);
  }

  async validate(payload: JwtPayload): Promise<JwtPayload> {
    this.utilityService.logPretty('Payload info:', payload);

    const user: JwtPayload = await this.authService.getUserFromPayload(
      payload.sub,
    );
    this.utilityService.logPretty('Validate user:', user);

    if (!user) {
      this.logger.error(AuthMessageLog.USER_NOT_FOUND_WITH_PAYLOAD);
      throw new UnauthorizedException(AuthErrorMessages.USER_NOT_EXISTS);
    }

    return user;
  }
}
