export async function load({ fetch }) {
  try {
    const response = await fetch("/api/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wordCount: 50 }),
    });

    if (!response.ok) {
      throw new Error("Failed to load initial session");
    }

    const data = await response.json();
    return {
      sessionId: data.sessionId,
      initialText: data.text,
    };
  } catch (error) {
    return {
      error: error.message,
    };
  }
}
