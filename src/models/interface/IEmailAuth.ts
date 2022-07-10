export default interface IEmailAuth {
  email: string;
  isVerified: boolean;
  expiresIn: Date;
  code?: string;
}
