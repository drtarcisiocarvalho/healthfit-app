import { z } from "zod";
import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
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
