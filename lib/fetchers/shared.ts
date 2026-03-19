export class FetcherError extends Error {
  constructor(message: string, public readonly status?: number) {
    super(message);
    this.name = "FetcherError";
  }
}

export async function fetchWithTimeout(url: string, init: RequestInit = {}, timeoutMs = 8000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { ...init, signal: controller.signal, next: { revalidate: 0 } });

    if (!response.ok) {
      throw new FetcherError(`Request failed for ${url}`, response.status);
    }

    return response;
  } finally {
    clearTimeout(timeout);
  }
}
