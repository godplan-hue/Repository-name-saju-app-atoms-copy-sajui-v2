export async function postWithRetry(url: string, body: unknown, retries = 4): Promise<boolean> {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) return true;
    } catch {}
    if (i < retries - 1) await new Promise(r => setTimeout(r, 700 * (i + 1)));
  }
  return false;
}
