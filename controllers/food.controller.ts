import { Request, Response } from 'express';
import prisma from '../prisma';

export class FoodController {
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, caloriesPer100g, carbsPer100g, proteinPer100g, fatPer100g } = req.body;

      if (!name || caloriesPer100g === undefined) {
        return res.status(400).json({ error: 'Nome e calorias por 100g são obrigatórios.' });
      }

      if (caloriesPer100g < 0 || carbsPer100g < 0 || proteinPer100g < 0 || fatPer100g < 0) {
        return res.status(400).json({ error: 'Os valores nutricionais não podem ser negativos.' });
      }

      const foodExists = await prisma.food.findUnique({
        where: { id: Number(id) }
      });

      if (!foodExists) {
        return res.status(404).json({ error: 'Alimento não encontrado.' });
      }

      const updatedFood = await prisma.food.update({
        where: { id: Number(id) },
        data: {
          name,
          caloriesPer100g: Number(caloriesPer100g),
          carbsPer100g: Number(carbsPer100g ?? 0),
          proteinPer100g: Number(proteinPer100g ?? 0),
          fatPer100g: Number(fatPer100g ?? 0),
        }
      });

      return res.status(200).json(updatedFood);
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno ao atualizar alimento.' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const foodExists = await prisma.food.findUnique({
        where: { id: Number(id) }
      });

      if (!foodExists) {
        return res.status(404).json({ error: 'Alimento não encontrado.' });
      }

      await prisma.food.delete({
        where: { id: Number(id) }
      });

      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno ao excluir alimento.' });
    }
  }
}
