import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import { accessPolicies, settingsByKey, settingsTabs, type SettingDef, type SettingValue } from "./settings.registry.js";

const CACHE_TTL_MS = 10_000;

@Injectable()
export class SettingsService {
  private cache: { values: Map<string, SettingValue>; loadedAt: number } | null = null;

  constructor(private readonly prisma: PrismaService) {}

  private async values() {
    if (this.cache && Date.now() - this.cache.loadedAt < CACHE_TTL_MS) return this.cache.values;
    const rows = await this.prisma.systemSetting.findMany();
    const values = new Map<string, SettingValue>();
    for (const def of settingsByKey.values()) values.set(def.key, def.default);
    for (const row of rows) {
      if (settingsByKey.has(row.key)) values.set(row.key, row.value as SettingValue);
    }
    this.cache = { values, loadedAt: Date.now() };
    return values;
  }

  async number(key: string) {
    return Number((await this.values()).get(key));
  }

  async bool(key: string) {
    return (await this.values()).get(key) === true;
  }

  async string(key: string) {
    return String((await this.values()).get(key));
  }

  /** The System Settings tabs with current values, in the shape the admin panel renders. */
  async tabs() {
    const values = await this.values();
    return settingsTabs.map((tab) => ({
      ...tab,
      cards: tab.cards.map((card) => ({
        ...card,
        fields: card.fields.map((field) => ({ ...field, value: values.get(field.key) })),
      })),
    }));
  }

  async accessPolicies() {
    const values = await this.values();
    return accessPolicies.map((policy) => ({ ...policy, value: values.get(policy.key) }));
  }

  /** Validates and saves a batch of changes. Returns the keys whose value actually changed. */
  async update(changes: Record<string, unknown>, actorId: string) {
    const current = await this.values();
    const updates: [string, SettingValue][] = [];
    for (const [key, raw] of Object.entries(changes)) {
      const def = settingsByKey.get(key);
      if (!def) throw new BadRequestException(`Unknown setting: ${key}`);
      const value = coerce(def, raw);
      if (current.get(key) !== value) updates.push([key, value]);
    }

    await this.prisma.$transaction(
      updates.map(([key, value]) =>
        this.prisma.systemSetting.upsert({
          where: { key },
          create: { key, value, updatedById: actorId },
          update: { value, updatedById: actorId },
        }),
      ),
    );
    this.cache = null;
    return updates.map(([key, value]) => ({ key, value, previous: current.get(key) }));
  }
}

function coerce(def: SettingDef, raw: unknown): SettingValue {
  const invalid = () => new BadRequestException(`Invalid value for ${def.label}`);
  switch (def.kind) {
    case "toggle":
      if (typeof raw !== "boolean") throw invalid();
      return raw;
    case "number": {
      const n = typeof raw === "string" ? Number(raw.replace(/[^\d.]/g, "")) : raw;
      if (typeof n !== "number" || !Number.isFinite(n)) throw invalid();
      if ((def.min !== undefined && n < def.min) || (def.max !== undefined && n > def.max)) {
        throw new BadRequestException(`${def.label} must be between ${def.min ?? "-∞"} and ${def.max ?? "∞"}`);
      }
      return Math.round(n);
    }
    case "select":
      if (typeof raw !== "string" || !def.options.includes(raw)) throw invalid();
      return raw;
    case "text":
      if (typeof raw !== "string" || raw.trim().length === 0 || raw.length > 200) throw invalid();
      return raw.trim();
  }
}
