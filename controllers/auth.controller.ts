import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma';
import { env } from '../config/env';

const GITHUB_AUTHORIZE_URL = 'https://github.com/login/oauth/authorize';
const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token';
const GITHUB_USER_URL = 'https://api.github.com/user';

// GET /auth/github
// Redireciona o navegador para a tela de autorização do GitHub.
export async function redirectToGithub(_req: Request, res: Response) {
  const params = new URLSearchParams({
    client_id: env.github.clientId,
    redirect_uri: env.github.callbackUrl,
    scope: 'read:user',
  });
  res.redirect(`${GITHUB_AUTHORIZE_URL}?${params.toString()}`);
}

// GET /auth/github/callback?code=...
// 1) troca o code pelo access_token
// 2) busca dados do usuário no GitHub
// 3) cria ou atualiza o User
// 4) emite um JWT e redireciona ao frontend
export async function githubCallback(req: Request, res: Response) {
  const code = req.query.code as string | undefined;
  if (!code) {
    return res.status(400).json({ error: 'Parâmetro "code" ausente.' });
  }

  const tokenResponse = await fetch(GITHUB_TOKEN_URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: env.github.clientId,
      client_secret: env.github.clientSecret,
      code,
      redirect_uri: env.github.callbackUrl,
    }),
  });

  const tokenData = (await tokenResponse.json()) as {
    access_token?: string;
    error?: string;
  };

  if (!tokenData.access_token) {
    return res
      .status(401)
      .json({ error: 'Falha ao obter access_token do GitHub.' });
  }

  const userResponse = await fetch(GITHUB_USER_URL, {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
      Accept: 'application/vnd.github+json',
      'User-Agent': 'sinutre-back',
    },
  });

  const githubUser = (await userResponse.json()) as {
    id: number;
    login: string;
    name: string | null;
    avatar_url: string | null;
  };

  const user = await prisma.user.upsert({
    where: { githubId: String(githubUser.id) },
    update: {
      githubLogin: githubUser.login,
      name: githubUser.name ?? githubUser.login,
      avatarUrl: githubUser.avatar_url ?? undefined,
    },
    create: {
      githubId: String(githubUser.id),
      githubLogin: githubUser.login,
      name: githubUser.name ?? githubUser.login,
      avatarUrl: githubUser.avatar_url ?? undefined,
    },
  });

  const token = jwt.sign({ sub: user.id }, env.jwtSecret, { expiresIn: '7d' });

  res.redirect(`${env.frontendUrl}/?token=${token}`);
}

// PUT /auth/profile
// Atualiza dados complementares do usuário (Meta Calórica, Peso, Altura)
export async function updateProfile(req: Request, res: Response) {
  try {
    const userId = req.userId;
    const { calorieGoal, weight, height } = req.body;

    if (calorieGoal === undefined && weight === undefined && height === undefined) {
      return res.status(400).json({ error: 'Nenhum dado informado para atualização.' });
    }

    if (calorieGoal !== undefined && (typeof calorieGoal !== 'number' || calorieGoal <= 0)) {
      return res.status(400).json({ error: 'A meta calórica deve ser um número maior que zero.' });
    }

    if (weight !== undefined && (typeof weight !== 'number' || weight <= 0)) {
      return res.status(400).json({ error: 'O peso deve ser um número maior que zero.' });
    }

    if (height !== undefined && (typeof height !== 'number' || height <= 0)) {
      return res.status(400).json({ error: 'A altura deve ser um número maior que zero.' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        calorieGoal: calorieGoal !== undefined ? Number(calorieGoal) : undefined,
        weight: weight !== undefined ? Number(weight) : undefined,
        height: height !== undefined ? Number(height) : undefined,
      },
    });

    return res.status(200).json({
      id: updatedUser.id,
      name: updatedUser.name,
      calorieGoal: updatedUser.calorieGoal,
      weight: updatedUser.weight,
      height: updatedUser.height,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno ao atualizar perfil.' });
  }
}
