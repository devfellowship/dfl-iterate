import type { Announcement } from '@/types';

export const announcementsData: Announcement[] = [
    {
      "id": "ann-1",
      "title": "Manutenção Programada",
      "body": "No domingo, 02h–04h, o iterate ficará indisponível para atualizações.",
      "severity": "warning",
      "publishedAt": "2026-05-20T10:00:00.000Z",
      "expiresAt": "2026-07-30T23:59:59.000Z"
    },
    {
      "id": "ann-2",
      "title": "Novas activities disponíveis",
      "body": "A lição E-commerce Frontend agora tem 17 activities para praticar.",
      "severity": "success",
      "publishedAt": "2026-05-15T08:00:00.000Z",
      "expiresAt": null
    },
    {
      "id": "ann-3",
      "title": "Dica da semana",
      "body": "Use o histórico de IA para revisar feedbacks das activities anteriores.",
      "severity": "info",
      "publishedAt": "2026-05-10T12:00:00.000Z",
      "expiresAt": null
    },
    {
      "id": "ann-4",
      "title": "Aviso expirado (não deve aparecer)",
      "body": "Este aviso tem expiresAt no passado e deve ser filtrado pelo service.",
      "severity": "warning",
      "publishedAt": "2020-01-01T00:00:00.000Z",
      "expiresAt": "2020-01-01T00:00:00.000Z"
    }
  ]