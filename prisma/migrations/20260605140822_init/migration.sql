-- CreateTable
CREATE TABLE "users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "githubId" TEXT NOT NULL,
    "githubLogin" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "birth_date" DATETIME,
    "avatar_url" TEXT,
    "gender" TEXT NOT NULL DEFAULT 'NAO_ESPECIFICADO',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "meals" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "eat_time" DATETIME NOT NULL,
    "description" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,
    CONSTRAINT "meals_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "foods" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "calories_per_100g" REAL NOT NULL,
    "carbs_per_100g" REAL NOT NULL,
    "protein_per_100g" REAL NOT NULL,
    "fat_per_100g" REAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    CONSTRAINT "foods_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "meal_foods" (
    "meal_id" INTEGER NOT NULL,
    "food_id" INTEGER NOT NULL,
    "food_g" REAL NOT NULL,
    "calories" REAL NOT NULL,
    "carbs" REAL NOT NULL,
    "protein" REAL NOT NULL,
    "fat" REAL NOT NULL,

    PRIMARY KEY ("meal_id", "food_id"),
    CONSTRAINT "meal_foods_meal_id_fkey" FOREIGN KEY ("meal_id") REFERENCES "meals" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "meal_foods_food_id_fkey" FOREIGN KEY ("food_id") REFERENCES "foods" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "weight_logs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "height" REAL NOT NULL,
    "weight" REAL NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,
    CONSTRAINT "weight_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "health_data" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "target_diet_daily" INTEGER NOT NULL,
    "level_activity" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closed_at" DATETIME,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "user_id" INTEGER NOT NULL,
    CONSTRAINT "health_data_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_githubId_key" ON "users"("githubId");

-- CreateIndex
CREATE UNIQUE INDEX "users_githubLogin_key" ON "users"("githubLogin");
