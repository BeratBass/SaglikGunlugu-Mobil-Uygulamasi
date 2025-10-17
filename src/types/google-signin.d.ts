declare module '@react-native-google-signin/google-signin' {
    export interface SignInResponse {
      idToken: string | null;
      user: {
        id: string;
        name: string | null;
        email: string | null;
        photo: string | null;
        familyName: string | null;
        givenName: string | null;
      };
    }
  
    export class GoogleSignin {
      static hasPlayServices(): Promise<boolean>;
      static signIn(): Promise<SignInResponse>;
      static configure(config: { webClientId: string }): void;
    }
  }