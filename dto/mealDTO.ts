interface CreateMealDTO {
  type: string;
  eatTime: string;
  description?: string;

  items: {
    foodId: number;
    grams: number;
  }[];
}