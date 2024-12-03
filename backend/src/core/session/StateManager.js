import { nanoid } from "nanoid";

export class StateManager {
  constructor() {
    this.sessions = new Map();
  }

  createSession() {
    const sessionId = nanoid();
    const session = {
      id: sessionId,
      startTime: null,
      endTime: null,
      text: null,
      input: "",
      status: "initialized",
    };
    this.sessions.set(sessionId, session);
    return session;
  }

  updateSession(sessionId, updates) {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error("Session not found");
    }

    const updatedSession = { ...session, ...updates };
    this.sessions.set(sessionId, updatedSession);
    return updatedSession;
  }

  getSession(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error("Session not found");
    }
    return session;
  }

  deleteSession(sessionId) {
    return this.sessions.delete(sessionId);
  }
}
