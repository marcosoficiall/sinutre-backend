import { Request, Response } from 'express';
import { prisma } from '../prisma';

export async function me(
  req: Request,
  res: Response,
) {
  const user = await prisma.user.findUnique({
    where: {
      id: req.userId,
    },
    select: {
      id: true,
      githubLogin: true,
      name: true,
      avatarUrl: true,
    },
  });

  return res.json(user);
}