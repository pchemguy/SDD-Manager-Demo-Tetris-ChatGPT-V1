/** Strict, independent game preferences with injected browser persistence. */
export const choices = {
  ghost: ["hide", "dynamic", "show"],
  hardDrop: ["off", "on"],
  preview: ["off", "on"],
  hardLock: ["general", "immediate"],
  lock: ["failed", "delay"],
  hold: ["off", "on"],
} as const;
export type SettingKey = keyof typeof choices;
export type Settings = { [K in SettingKey]: (typeof choices)[K][number] };
export const defaults: Settings = {
  ghost: "show",
  hardDrop: "on",
  preview: "on",
  hardLock: "general",
  lock: "delay",
  hold: "on",
};
export const keys = Object.keys(choices) as SettingKey[];
export function validSetting<K extends SettingKey>(
  key: K,
  value: string,
): value is Settings[K] {
  return (choices[key] as readonly string[]).includes(value);
}
export function setSetting<K extends SettingKey>(
  settings: Settings,
  key: K,
  value: string,
) {
  if (!validSetting(key, value)) return false;
  settings[key] = value;
  return true;
}

export const labels: Record<SettingKey, string> = {
  ghost: "Ghost visibility",
  hardDrop: "Hard drop",
  preview: "Next-piece preview",
  hardLock: "Hard-drop locking policy",
  lock: "General locking policy",
  hold: "Hold piece",
};
export const optionLabels: Record<string, string> = {
  hide: "Always hide",
  dynamic: "Hide above midline",
  show: "Always show",
  off: "Off",
  on: "On",
  general: "Use general policy",
  immediate: "Lock immediately",
  failed: "Failed downward attempt",
  delay: "Full gravity interval",
};
export interface PreferenceEnvironment {
  url(): string;
  cookies(): string;
  writeCookie(value: string): void;
  replaceUrl(value: string): void;
}
/** Decode cookie fields safely; callers select only named preference cookies. */
function cookieValues(raw: string) {
  const result = new Map<string, string>();
  for (const field of raw.split(";")) {
    const equal = field.indexOf("=");
    if (equal < 0) continue;
    const name = field.slice(0, equal).trim();
    if (result.has(name)) continue;
    try {
      result.set(name, decodeURIComponent(field.slice(equal + 1).trim()));
    } catch {
      /* Invalid cookie falls back independently. */
    }
  }
  return result;
}
/** Resolve once, then persist only explicit URL values and individual user changes. */
export function createPreferences(env: PreferenceEnvironment) {
  const values = { ...defaults };
  const store = { values, warning: false, save };
  let params = new URLSearchParams();
  let saved = new Map<string, string>();
  let secure = false;
  try {
    const url = new URL(env.url());
    params = url.searchParams;
    secure = url.protocol === "https:";
  } catch {
    store.warning = true;
  }
  try {
    saved = cookieValues(env.cookies());
  } catch {
    store.warning = true;
  }
  function persistCookie(key: SettingKey, value: string) {
    try {
      const name = "tetris_" + key;
      env.writeCookie(
        name +
          "=" +
          encodeURIComponent(value) +
          "; Path=/; SameSite=Lax; Max-Age=31536000" +
          (secure ? "; Secure" : ""),
      );
      if (cookieValues(env.cookies()).get(name) !== value) store.warning = true;
    } catch {
      store.warning = true;
    }
  }
  function save(key: SettingKey, value: string) {
    if (!setSetting(values, key, value)) return false;
    persistCookie(key, value);
    try {
      const url = new URL(env.url());
      url.searchParams.set(key, value);
      env.replaceUrl(url.toString());
    } catch {
      store.warning = true;
    }
    return true;
  }
  for (const key of keys) {
    const explicit = params.getAll(key);
    if (explicit.length === 1 && validSetting(key, explicit[0])) {
      setSetting(values, key, explicit[0]);
      persistCookie(key, explicit[0]);
    } else {
      const cookie = saved.get("tetris_" + key);
      if (cookie !== undefined) setSetting(values, key, cookie);
    }
  }
  return store;
}
export type PreferenceStore = ReturnType<typeof createPreferences>;
