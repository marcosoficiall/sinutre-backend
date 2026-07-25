export interface MealSummaryDTO {
  id: number;
  name: string;

  totals: {
    grams: number;
    calories: number;
    carbs: number;
    proteins: number;
    fats: number;
  };
}