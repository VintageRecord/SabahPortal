"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { StreamPlatform } from "@prisma/client";

function revalidateAll() {
  revalidatePath("/admin/streams");
  revalidatePath("/strim");
  revalidatePath("/", "layout");
}

export async function createStreamAction(formData: FormData) {
  const divisionId = String(formData.get("divisionId"));
  const platform = String(formData.get("platform")) as StreamPlatform;
  const title = String(formData.get("title")).trim();
  const url = String(formData.get("url")).trim();
  const isLive = formData.get("isLive") === "on";
  if (!divisionId || !title || !url) return;

  const order = await prisma.streamLink.count();

  await prisma.streamLink.create({
    data: { divisionId, platform, title, url, isLive, order },
  });

  revalidateAll();
}

export async function updateStreamAction(formData: FormData) {
  const streamId = String(formData.get("streamId"));
  const divisionId = String(formData.get("divisionId"));
  const platform = String(formData.get("platform")) as StreamPlatform;
  const title = String(formData.get("title")).trim();
  const url = String(formData.get("url")).trim();
  const isLive = formData.get("isLive") === "on";

  await prisma.streamLink.update({
    where: { id: streamId },
    data: { divisionId, platform, title, url, isLive },
  });

  revalidateAll();
}

export async function deleteStreamAction(formData: FormData) {
  const streamId = String(formData.get("streamId"));
  await prisma.streamLink.delete({ where: { id: streamId } });
  revalidateAll();
}
