import 'dotenv/config';

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Variável de ambiente obrigatória ausente: ${name}`);
  }
  return value;
}

export const env = {
  port: Number(process.env.PORT ?? 3333),
  jwtSecret: required('JWT_SECRET'),
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:5173',
  github: {
    clientId: required('GITHUB_CLIENT_ID'),
    clientSecret: required('GITHUB_CLIENT_SECRET'),
    callbackUrl: required('GITHUB_CALLBACK_URL'),
  },
};
