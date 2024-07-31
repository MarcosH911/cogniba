"use server";

import { avg, count, eq, sum } from "drizzle-orm";
import { db } from "@/database/db";
import { games } from "@/database/schemas/games";
import getUser from "@/database/queries/users/getUser";
import { date } from "@/database/queries/functions";
import { UserType } from "@/database/schemas/auth";

export type DailyGamesData = {
  gamesPlayed: number;
  level: number;
  correctHits: number;
  incorrectHits: number;
  missedHits: number;
  timePlayed: number;
  date: string;
}[];

export default async function getDailyGamesData(
  user?: UserType,
): Promise<DailyGamesData> {
  let userId: string;

  if (user) {
    userId = user.id;
  } else {
    const user = await getUser();
    userId = user.id;
  }

  const gamesData = await db
    .select({
      gamesPlayed: count(games.level),
      level: avg(games.level).mapWith(Number),
      correctHits: avg(games.correctHits).mapWith(Number),
      incorrectHits: avg(games.incorrectHits).mapWith(Number),
      missedHits: avg(games.missedHits).mapWith(Number),
      timePlayed: sum(games.timePlayed).mapWith(Number),
      date: date(games.createdAt),
    })
    .from(games)
    .where(eq(games.userId, userId))
    .groupBy(date(games.createdAt))
    .orderBy(date(games.createdAt));

  return gamesData;
}
