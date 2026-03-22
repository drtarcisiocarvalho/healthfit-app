import { z } from "zod";
import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";
import { professionalsRouter, appItemsRouter } from "./admin-routers";

export const appRouter = router({
  system: systemRouter,
  professionals: professionalsRouter,
  appItems: appItemsRouter,

  // Stripe payment (server-side - secret key never exposed to frontend)
  payments: router({
    createIntent: publicProcedure
      .input(
        z.object({
          amount: z.number().positive(),
          currency: z.string().default("brl"),
          productId: z.string(),
          productName: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        // In production, use Stripe SDK with STRIPE_SECRET_KEY
        // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        // const intent = await stripe.paymentIntents.create({
        //   amount: Math.round(input.amount * 100),
        //   currency: input.currency,
        //   metadata: { productId: input.productId, productName: input.productName },
        // });
        // return { clientSecret: intent.client_secret, id: intent.id };

        // Simulated for development
        const id = `pi_${Date.now()}`;
        return {
          clientSecret: `${id}_secret_dev`,
          id,
          amount: Math.round(input.amount * 100),
          currency: input.currency,
        };
      }),
  }),
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Chat com IA
  chat: publicProcedure
    .input(
      z.object({
        messages: z.array(
          z.object({
            role: z.enum(["system", "user", "assistant"]),
            content: z.string(),
          })
        ),
        userContext: z
          .object({
            workouts: z.array(z.any()).optional(),
            vitalSigns: z.array(z.any()).optional(),
            bodyComposition: z.array(z.any()).optional(),
          })
          .optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { messages, userContext } = input;

      // Construir contexto do usuário
      let contextMessage = "";
      if (userContext) {
        contextMessage = "\n\nContexto do usuário:\n";
        if (userContext.workouts && userContext.workouts.length > 0) {
          contextMessage += `- Total de treinos: ${userContext.workouts.length}\n`;
          const lastWorkout = userContext.workouts[0];
          contextMessage += `- Último treino: ${lastWorkout.type}, ${lastWorkout.duration} min, ${lastWorkout.calories} kcal\n`;
        }
        if (userContext.vitalSigns && userContext.vitalSigns.length > 0) {
          contextMessage += `- Total de medições de sinais vitais: ${userContext.vitalSigns.length}\n`;
        }
        if (userContext.bodyComposition && userContext.bodyComposition.length > 0) {
          const latest = userContext.bodyComposition[0];
          contextMessage += `- Última composição corporal: Peso ${latest.weight}kg, IMC ${latest.bmi}\n`;
        }
      }

      // Adicionar contexto à mensagem do sistema
      const enhancedMessages = [
        {
          role: "system" as const,
          content: `Você é um assistente virtual de saúde e fitness especializado. Seu nome é HealthFit AI. Você ajuda usuários a entender seus dados de saúde, fornece insights personalizados e recomendações baseadas em evidências científicas. Seja sempre positivo, motivador e empolgante.${contextMessage}`,
        },
        ...messages,
      ];

      const response = await invokeLLM({
        messages: enhancedMessages,
      });

      return {
        message: response.choices[0].message.content,
      };
    }),
});

export type AppRouter = typeof appRouter;
