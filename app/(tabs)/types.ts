// types.ts
export type RootStackParamList = {
  SignUp: undefined;
  EmailSignUp: undefined;
  Home: undefined;
  signUp1NameEmailDOB: undefined;
  signUp2VerifyEmail: { email: string };
  signUp3OptionalMobile: { email: string; code: string };
  signUp4EmailConnect: undefined;
  setPassword: undefined;
  customizeProfile: undefined;
  homescreen: undefined;
  // Add other screens here
};