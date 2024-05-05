CREATE TABLE "users" (
    "id_user" SERIAL NOT NULL,
    "email" TEXT NOT NULL UNIQUE,
    "hashed_password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "id_user" PRIMARY KEY ("id_user")
);