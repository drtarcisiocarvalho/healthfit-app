import { z } from "zod";
import { eq } from "drizzle-orm";
import { adminProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { professionals, appItems } from "../drizzle/schema";

// ─── Professional management (telemedicine) ───
export const professionalsRouter = router({
  list: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    return db.select().from(professionals).orderBy(professionals.name);
  }),

  create: adminProcedure
    .input(
      z.object({
        name: z.string().min(2),
        specialty: z.string().min(2),
        crm: z.string().optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        bio: z.string().optional(),
        avatarUrl: z.string().url().optional(),
        price: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.insert(professionals).values({
        name: input.name,
        specialty: input.specialty,
        crm: input.crm ?? null,
        email: input.email ?? null,
        phone: input.phone ?? null,
        bio: input.bio ?? null,
        avatarUrl: input.avatarUrl ?? null,
        price: input.price ?? null,
      });
      return { success: true };
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(2).optional(),
        specialty: z.string().min(2).optional(),
        crm: z.string().optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        bio: z.string().optional(),
        avatarUrl: z.string().url().optional(),
        available: z.boolean().optional(),
        price: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const { id, ...data } = input;
      const updateSet: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(data)) {
        if (value !== undefined) updateSet[key] = value;
      }
      if (Object.keys(updateSet).length > 0) {
        await db.update(professionals).set(updateSet).where(eq(professionals.id, id));
      }
      return { success: true };
    }),

  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.delete(professionals).where(eq(professionals.id, input.id));
      return { success: true };
    }),
});

// ─── App items management (admin CRUD for any content) ───
export const appItemsRouter = router({
  list: adminProcedure
    .input(z.object({ type: z.enum(["product", "challenge", "workout", "tip"]).optional() }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      if (input?.type) {
        return db.select().from(appItems).where(eq(appItems.type, input.type));
      }
      return db.select().from(appItems).orderBy(appItems.createdAt);
    }),

  create: adminProcedure
    .input(
      z.object({
        type: z.enum(["product", "challenge", "workout", "tip"]),
        title: z.string().min(1),
        description: z.string().optional(),
        imageUrl: z.string().url().optional(),
        data: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.insert(appItems).values({
        type: input.type,
        title: input.title,
        description: input.description ?? null,
        imageUrl: input.imageUrl ?? null,
        data: input.data ?? null,
      });
      return { success: true };
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1).optional(),
        description: z.string().optional(),
        imageUrl: z.string().url().optional(),
        data: z.string().optional(),
        active: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const { id, ...data } = input;
      const updateSet: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(data)) {
        if (value !== undefined) updateSet[key] = value;
      }
      if (Object.keys(updateSet).length > 0) {
        await db.update(appItems).set(updateSet).where(eq(appItems.id, id));
      }
      return { success: true };
    }),

  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.delete(appItems).where(eq(appItems.id, input.id));
      return { success: true };
    }),
});
