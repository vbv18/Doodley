import { getRedis } from "@repo/db";
import { WB_TTL_SECONDS } from "@repo/config";

const WB_KEY = (roomId: number) => `wb:${roomId}`;

export async function saveWhiteboardToRedis(
  roomId: number,
  elements: unknown[],
): Promise<void> {
  const redis = getRedis();
  await redis.set(WB_KEY(roomId), JSON.stringify(elements), {
    EX: WB_TTL_SECONDS,
  });
}

export async function loadWhiteboardFromRedis(
  roomId: number,
): Promise<unknown[] | null> {
  const redis = getRedis();
  const raw = await redis.get(WB_KEY(roomId));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as unknown[];
  } catch {
    return null;
  }
}

export async function evictWhiteboardFromRedis(roomId: number): Promise<void> {
  const redis = getRedis();
  await redis.del(WB_KEY(roomId));
}

export function isRedisAvailable(): boolean {
  try {
    const redis = getRedis();
    return redis.isOpen;
  } catch {
    return false;
  }
}
