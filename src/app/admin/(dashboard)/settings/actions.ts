"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function updateSettingsAction(formData: FormData) {
  const title = String(formData.get("title")).trim();
  const subtitle = String(formData.get("subtitle")).trim();
  const organizer = String(formData.get("organizer")).trim();
  const startDate = String(formData.get("startDate"));
  const endDate = String(formData.get("endDate"));
  const pointsWin = Number(formData.get("pointsWin"));
  const pointsDraw = Number(formData.get("pointsDraw"));
  const pointsLoss = Number(formData.get("pointsLoss"));

  await prisma.eventSettings.update({
    where: { id: 1 },
    data: {
      title,
      subtitle,
      organizer,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      pointsWin: Number.isFinite(pointsWin) ? pointsWin : 3,
      pointsDraw: Number.isFinite(pointsDraw) ? pointsDraw : 1,
      pointsLoss: Number.isFinite(pointsLoss) ? pointsLoss : 0,
    },
  });

  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
}
