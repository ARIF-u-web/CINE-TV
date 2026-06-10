// Local-only auth store (localStorage). Demo accounts for CINE TV.
// NOT real authentication — for UI/demo purposes. Includes an admin role.

export type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  createdAt: number;
};

type StoredUser = User & { passwordHash: string };

const USERS = "cinetv:users";
const SESSION = "cinetv:session";

function emit() {
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("cinetv:auth"));
}

async function hash(pw: string): Promise<string> {
  if (typeof crypto !== "undefined" && crypto.subtle) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(pw));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
  }
  return btoa(pw);
}

function readUsers(): StoredUser[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(USERS) ?? "[]"); } catch { return []; }
}
function writeUsers(u: StoredUser[]) { localStorage.setItem(USERS, JSON.stringify(u)); }

function seedAdmin(email: string, name: string, password: string) {
  const users = readUsers();
  if (users.some(u => u.email === email)) return;
  hash(password).then(passwordHash => {
    const next = readUsers();
    if (next.some(u => u.email === email)) return;
    next.push({
      id: crypto.randomUUID(), name, email,
      role: "admin", createdAt: Date.now(), passwordHash,
    });
    writeUsers(next);
  });
}

function ensureAdminSeed() {
  seedAdmin("admin@cinetv.local", "CINE TV Admin", "admin123");
  seedAdmin("islam.islam.arif333@gmail.com", "Arif", "@Arif123@");
}


export const auth = {
  init() { if (typeof window !== "undefined") ensureAdminSeed(); },
  current(): User | null {
    if (typeof window === "undefined") return null;
    try { return JSON.parse(localStorage.getItem(SESSION) ?? "null"); } catch { return null; }
  },
  isAdmin(): boolean { return this.current()?.role === "admin"; },
  async signUp(name: string, email: string, password: string): Promise<User> {
    email = email.trim().toLowerCase();
    if (!name.trim()) throw new Error("Name is required");
    if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error("Invalid email");
    if (password.length < 6) throw new Error("Password must be at least 6 characters");
    const users = readUsers();
    if (users.some(u => u.email === email)) throw new Error("Email already registered");
    const user: StoredUser = {
      id: crypto.randomUUID(), name: name.trim(), email,
      role: users.length === 0 ? "admin" : "user",
      createdAt: Date.now(), passwordHash: await hash(password),
    };
    users.push(user);
    writeUsers(users);
    const { passwordHash, ...pub } = user;
    localStorage.setItem(SESSION, JSON.stringify(pub));
    emit();
    return pub;
  },
  async signIn(email: string, password: string): Promise<User> {
    email = email.trim().toLowerCase();
    const users = readUsers();
    const u = users.find(x => x.email === email);
    if (!u) throw new Error("No account found with that email");
    const ph = await hash(password);
    if (u.passwordHash !== ph) throw new Error("Incorrect password");
    const { passwordHash, ...pub } = u;
    localStorage.setItem(SESSION, JSON.stringify(pub));
    emit();
    return pub;
  },
  signOut() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(SESSION);
    emit();
  },
  updateProfile(patch: Partial<Pick<User, "name" | "email">>) {
    const cur = this.current();
    if (!cur) throw new Error("Not signed in");
    const users = readUsers();
    const idx = users.findIndex(u => u.id === cur.id);
    if (idx < 0) throw new Error("Account missing");
    users[idx] = { ...users[idx], ...patch };
    writeUsers(users);
    const { passwordHash, ...pub } = users[idx];
    localStorage.setItem(SESSION, JSON.stringify(pub));
    emit();
    return pub;
  },
  async changePassword(oldPw: string, newPw: string) {
    const cur = this.current();
    if (!cur) throw new Error("Not signed in");
    if (newPw.length < 6) throw new Error("New password must be at least 6 characters");
    const users = readUsers();
    const idx = users.findIndex(u => u.id === cur.id);
    if (idx < 0) throw new Error("Account missing");
    if (users[idx].passwordHash !== await hash(oldPw)) throw new Error("Current password is incorrect");
    users[idx].passwordHash = await hash(newPw);
    writeUsers(users);
  },
  listUsers(): User[] {
    return readUsers().map(({ passwordHash, ...u }) => u);
  },
  deleteUser(id: string) {
    if (!this.isAdmin()) throw new Error("Admin only");
    writeUsers(readUsers().filter(u => u.id !== id));
    emit();
  },
  setRole(id: string, role: "admin" | "user") {
    if (!this.isAdmin()) throw new Error("Admin only");
    const users = readUsers();
    const idx = users.findIndex(u => u.id === id);
    if (idx < 0) return;
    users[idx].role = role;
    writeUsers(users);
    emit();
  },
};
