import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '@/modules/auth/application/services/auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID', 'placeholder-google-client-id'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET', 'placeholder-google-client-secret'),
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL', 'http://localhost:3001/auth/google/callback'),
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback): Promise<void> {
    try {
      const email = profile.emails?.[0]?.value;
      if (!email) {
        return done(new Error('No email found from Google profile'), undefined);
      }

      const displayName =
        profile.displayName ||
        `${profile.name?.familyName || ''} ${profile.name?.givenName || ''}`.trim() ||
        email.split('@')[0];

      const avatar = profile.photos?.[0]?.value;

      const user = await this.authService.validateOrCreateGoogleUser({
        email,
        displayName,
        avatar,
      });

      done(null, user);
    } catch (error) {
      done(error as Error, undefined);
    }
  }
}
