'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button, Input, Textarea, MemberSelector, MediaUpload } from '@/components/ui';
import { useEventStore } from '@/stores/event-store';
import { useMamacoConfirmation } from '@/hooks/useMamacoConfirmation';
import type { Event, EventStatus, Member, MediaItem } from '@/types/story';

interface UploadedFile {
  id: string;
  url: string;
  type: 'image' | 'video' | 'audio';
}

const eventSchema = z.object({
  title: z
    .string()
    .min(3, 'O titulo deve ter pelo menos 3 caracteres')
    .max(100, 'O titulo deve ter no maximo 100 caracteres'),
  description: z
    .string()
    .max(500, 'A descricao deve ter no maximo 500 caracteres')
    .optional(),
  location: z
    .string()
    .max(200, 'O local deve ter no maximo 200 caracteres')
    .optional(),
  date: z.string().min(1, 'A data e obrigatoria'),
  createdBy: z
    .string()
    .min(2, 'O nome deve ter pelo menos 2 caracteres')
    .max(50, 'O nome deve ter no maximo 50 caracteres'),
  status: z.enum(['upcoming', 'ongoing', 'completed', 'cancelled']).optional(),
});

type EventFormData = z.infer<typeof eventSchema>;

interface EventFormProps {
  initialData?: Partial<Event> & { participants?: Member[]; participantIds?: string[]; media?: MediaItem[] };
  mode?: 'create' | 'edit';
}

export function EventForm({ initialData, mode = 'create' }: EventFormProps) {
  const router = useRouter();
  const { createEvent, updateEvent } = useEventStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [media, setMedia] = useState<UploadedFile[]>(
    initialData?.media?.map((m) => ({ id: m.id, url: m.url, type: m.type })) || []
  );
  const [participantIds, setParticipantIds] = useState<string[]>(
    initialData?.participantIds || initialData?.participants?.map((p) => p.id) || []
  );

  const { confirm, MamacoComponents } = useMamacoConfirmation({
    successMessage: mode === 'edit' ? 'EVENTO EDITADO!!!' : 'BORA PRO ROLÊ!!!',
  });

  const formatDateForInput = (dateStr?: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toISOString().slice(0, 16);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      location: initialData?.location || '',
      date: formatDateForInput(initialData?.date) || '',
      createdBy: initialData?.createdBy || '',
      status: initialData?.status || 'upcoming',
    },
  });

  const executeSubmit = async (data: EventFormData) => {
    setIsSubmitting(true);

    try {
      const eventData = {
        title: data.title,
        description: data.description,
        location: data.location,
        date: data.date,
        createdBy: data.createdBy,
        status: (data.status || 'upcoming') as EventStatus,
        participantIds,
        media: media.map((m) => ({
          id: m.id,
          url: m.url,
          type: m.type,
        })),
      };

      if (mode === 'edit' && initialData?.id) {
        await updateEvent(initialData.id, eventData);
      } else {
        await createEvent(eventData);
      }

      // Wait for monkey animation before redirect
      setTimeout(() => {
        router.push('/eventos');
      }, 2800);
    } catch (error) {
      console.error('Erro ao salvar evento:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = (data: EventFormData) => {
    confirm(() => executeSubmit(data));
  };

  return (
    <>
      <MamacoComponents />
      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Title */}
        <Input
          label="Nome do Evento"
          placeholder="Ex: Churras do Caos"
          error={errors.title?.message}
          {...register('title')}
        />

        {/* Created By */}
        <Input
          label="Quem ta organizando?"
          placeholder="Seu apelido de guerra"
          error={errors.createdBy?.message}
          {...register('createdBy')}
        />

        {/* Date */}
        <div className="space-y-2">
          <label className="font-[var(--font-display)] text-sm text-[var(--text-secondary)] uppercase tracking-wider block">
            Data e Hora
          </label>
          <input
            type="datetime-local"
            className="input-chaos w-full bg-[var(--surface-card)]"
            {...register('date')}
          />
          {errors.date && (
            <span className="text-[var(--neon-orange)] text-sm font-[var(--font-body)]">
              {errors.date.message}
            </span>
          )}
        </div>

        {/* Location */}
        <Input
          label="Local (opcional)"
          placeholder="Onde vai rolar o caos?"
          error={errors.location?.message}
          {...register('location')}
        />

        {/* Description */}
        <Textarea
          label="Descricao (opcional)"
          placeholder="Detalhes sobre o evento..."
          hint="O que rola? O que levar? Quanto custa?"
          rows={4}
          error={errors.description?.message}
          {...register('description')}
        />

        {/* Participants */}
        <MemberSelector
          label="Quem Vai Participar?"
          hint="Selecione os membros confirmados para o role"
          placeholder="Buscar membros..."
          selectedIds={participantIds}
          onChange={setParticipantIds}
        />

        {/* Media Upload */}
        <div className="space-y-2">
          <label className="font-[var(--font-display)] text-sm text-[var(--text-secondary)] uppercase tracking-wider block">
            Fotos e Videos do Evento
          </label>
          <p className="text-xs text-[var(--text-muted)] font-[var(--font-body)] mb-2">
            Suba as provas da mamacada! Fotos, videos e audios.
          </p>
          <MediaUpload
            existingFiles={media}
            onFilesChange={setMedia}
            maxFiles={20}
          />
        </div>

        {/* Status (only in edit mode) */}
        {mode === 'edit' && (
          <div className="space-y-2">
            <label className="font-[var(--font-display)] text-sm text-[var(--text-secondary)] uppercase tracking-wider block">
              Status
            </label>
            <select
              className="input-chaos w-full bg-[var(--surface-card)]"
              {...register('status')}
            >
              <option value="upcoming">Em breve</option>
              <option value="ongoing">Rolando</option>
              <option value="completed">Finalizado</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>
        )}

        {/* Submit Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-[var(--surface-elevated)]">
          <Button
            type="submit"
            variant="neon"
            size="lg"
            isLoading={isSubmitting}
            className="flex-1"
            glitch
          >
            {mode === 'edit' ? 'Salvar Alteracoes' : 'Criar Evento'}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="lg"
            onClick={() => router.back()}
            className="flex-1 sm:flex-none"
          >
            Cancelar
          </Button>
        </div>
      </motion.form>
    </>
  );
}
