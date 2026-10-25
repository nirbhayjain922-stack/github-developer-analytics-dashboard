const USERS_KEY = "github-analytics-users";
const SESSION_KEY = "github-analytics-session";

async function hashPassword(password) {
  const encoded = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export function getStoredUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveSession(user) {
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({
      email: user.email,
      createdAt: user.createdAt,
    })
  );
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export async function registerUser(email, password) {
  const normalizedEmail = email.trim().toLowerCase();
  const users = getStoredUsers();

  if (users.some((user) => user.email === normalizedEmail)) {
    throw new Error("An account with this email already exists.");
  }

  const passwordHash = await hashPassword(password);
  const user = {
    email: normalizedEmail,
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  saveUsers([...users, user]);
  saveSession(user);
  return getSession();
}

export async function loginUser(email, password) {
  const normalizedEmail = email.trim().toLowerCase();
  const users = getStoredUsers();
  const match = users.find((user) => user.email === normalizedEmail);

  if (!match) {
    throw new Error("No account found for this email. Please sign up.");
  }

  const passwordHash = await hashPassword(password);

  if (passwordHash !== match.passwordHash) {
    throw new Error("Incorrect password. Please try again.");
  }

  saveSession(match);
  return getSession();
}
