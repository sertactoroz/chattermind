import { headers } from 'next/headers';

export async function getAuthUserId(): Promise<string | null> {
  try {
    const headersList = await headers();
    const authHeader = headersList.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) return null;

    const token = authHeader.slice(7);
    const payload = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString()
    );
    return payload.sub ?? null;
  } catch {
    return null;
  }
}

export async function getAuthUser() {
  try {
    const headersList = await headers();
    const authHeader = headersList.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) return null;

    const token = authHeader.slice(7);
    const payload = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString()
    );
    return { id: payload.sub, email: payload.email };
  } catch {
    return null;
  }
}
