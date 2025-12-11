-- CreateEnum
CREATE TYPE "StudentGoal" AS ENUM ('JEE_PREPARATION', 'NEET_PREPARATION', 'CAT_PREPARATION', 'ENGINEERING', 'MEDICAL', 'GATE_PREPARATION', 'UPSC_PREPARATION', 'SKILL_DEVELOPMENT', 'SCHOOL_CURRICULUM', 'OTHER');

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "targetAudience" "StudentGoal"[] DEFAULT ARRAY[]::"StudentGoal"[];

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "goals" "StudentGoal"[] DEFAULT ARRAY[]::"StudentGoal"[];
