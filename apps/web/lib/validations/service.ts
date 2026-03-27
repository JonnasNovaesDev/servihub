import { z } from "zod";

export const createServiceSchema = z.object({
  categoryId: z.string().cuid("Categoria inválida"),
  title: z.string().min(5, "Título deve ter pelo menos 5 caracteres").max(100),
  description: z.string().min(20, "Descrição deve ter pelo menos 20 caracteres").max(2000),
  priceFrom: z.coerce.number().positive("Preço deve ser positivo"),
  priceUnit: z.enum(["HOUR", "DAY", "FIXED"]),
});

export const createRequestSchema = z.object({
  serviceId: z.string().cuid("Serviço inválido"),
  message: z.string().max(500).optional(),
  scheduledAt: z.coerce.date().optional(),
});

export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type CreateRequestInput = z.infer<typeof createRequestSchema>;
