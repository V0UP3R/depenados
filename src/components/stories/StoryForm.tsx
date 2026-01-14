'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button, Input, Textarea, MediaUpload, MemberSelector } from '@/components/ui';
import { useStoryStore } from '@/stores/story-store';
import { useMamacoConfirmation } from '@/hooks/useMamacoConfirmation';
import type { MediaItem, Member } from '@/types/story';

const storySchema = z.object({
  title: z
    .string()
    .min(3, 'O titulo deve ter pelo menos 3 caracteres')
    .max(100, 'O titulo deve ter no maximo 100 caracteres'),
  content: z
    .string()
    .min(50, 'A historia deve ter pelo menos 50 caracteres')
    .max(10000, 'A historia deve ter no maximo 10000 caracteres'),
  excerpt: z
    .string()
    .max(300, 'O resumo deve ter no maximo 300 caracteres')
    .optional(),
  author: z
    .string()
    .min(2, 'O nome do autor deve ter pelo menos 2 caracteres')
    .max(50, 'O nome do autor deve ter no maximo 50 caracteres'),
  tags: z.string().optional(),
  featured: z.boolean().optional(),
});

type StoryFormData = z.infer<typeof storySchema>;

interface UploadedFile {
  id: string;
  url: string;
  type: 'image' | 'video' | 'audio';
}

interface StoryFormProps {
  initialData?: Partial<StoryFormData> & { id?: string; media?: MediaItem[]; participants?: Member[]; participantIds?: string[] };
  mode?: 'create' | 'edit';
}

export function StoryForm({ initialData, mode = 'create' }: StoryFormProps) {
  const router = useRouter();
  const { createStory, updateStory } = useStoryStore();
  const [media, setMedia] = useState<UploadedFile[]>(
    initialData?.media?.map((m) => ({ id: m.id, url: m.url, type: m.type })) || []
  );
  const [participantIds, setParticipantIds] = useState<string[]>(
    initialData?.participantIds || initialData?.participants?.map((p) => p.id) || []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { confirm, MamacoComponents } = useMamacoConfirmation({
    successMessage: mode === 'edit' ? 'EDITADO!!!' : 'PUBLICADO!!!',
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StoryFormData>({
    resolver: zodResolver(storySchema),
    defaultValues: {
      title: initialData?.title || '',
      content: initialData?.content || '',
      excerpt: initialData?.excerpt || '',
      author: initialData?.author || '',
      tags: Array.isArray(initialData?.tags) ? initialData.tags.join(', ') : initialData?.tags || '',
      featured: initialData?.featured || false,
    },
  });

  const executeSubmit = async (data: StoryFormData) => {
    setIsSubmitting(true);

    try {
      const tags = data.tags
        ? data.tags.split(',').map((tag) => tag.trim().toLowerCase())
        : [];

      const coverImage = media.find((m) => m.type === 'image')?.url;

      const storyData = {
        title: data.title,
        content: data.content,
        excerpt: data.excerpt,
        author: data.author,
        tags,
        featured: data.featured || false,
        coverImage,
        participantIds,
        media: media.map((m) => ({
          id: m.id,
          type: m.type,
          url: m.url,
        })),
      };

      if (mode === 'edit' && initialData?.id) {
        await updateStory(initialData.id, storyData);
      } else {
        await createStory(storyData);
      }

      // Wait for monkey animation before redirect
      setTimeout(() => {
        router.push('/historias');
      }, 2800);
    } catch (error) {
      console.error('Erro ao salvar historia:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = (data: StoryFormData) => {
    confirm(() => executeSubmit(data));
  };

  const handleFilesChange = (files: UploadedFile[]) => {
    setMedia(files);
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
          label="Titulo da Mamacada"
          placeholder="Ex: A Noite que Ninguem Lembra"
          error={errors.title?.message}
          {...register('title')}
        />

        {/* Author */}
        <Input
          label="Quem Ta Contando?"
          placeholder="Seu apelido de guerra"
          error={errors.author?.message}
          {...register('author')}
        />

        {/* Participants */}
        <MemberSelector
          label="Quem Participou da Mamacada?"
          hint="Selecione os membros que estavam presentes nessa historia"
          placeholder="Buscar membros..."
          selectedIds={participantIds}
          onChange={setParticipantIds}
        />

        {/* Excerpt */}
        <Textarea
          label="Resumo (opcional)"
          placeholder="Uma previa da mamacada..."
          hint="Algo pra instigar a curiosidade dos outros"
          rows={3}
          error={errors.excerpt?.message}
          {...register('excerpt')}
        />

        {/* Content */}
        <Textarea
          label="A Historia Completa"
          placeholder="Tudo comecou quando alguem disse 'so mais uma'..."
          hint="Conte todos os detalhes. Nao poupe ninguem."
          rows={12}
          error={errors.content?.message}
          {...register('content')}
        />

        {/* Tags */}
        <Input
          label="Tags"
          placeholder="bebedeira, mamacada, caos (separadas por virgula)"
          hint="Palavras-chave pra encontrar depois"
          error={errors.tags?.message}
          {...register('tags')}
        />

        {/* Featured Checkbox */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="checkbox"
              id="featured"
              className="sr-only peer"
              {...register('featured')}
            />
            <div className="w-6 h-6 border-2 border-[var(--surface-elevated)] peer-checked:border-[var(--neon-green)] peer-checked:bg-[var(--neon-green)]/20 transition-all cursor-pointer flex items-center justify-center">
              <svg
                className="w-4 h-4 text-[var(--neon-green)] opacity-0 peer-checked:opacity-100 transition-opacity"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <label htmlFor="featured" className="absolute inset-0 cursor-pointer" />
          </div>
          <label
            htmlFor="featured"
            className="font-[var(--font-display)] text-sm text-[var(--text-secondary)] uppercase tracking-wider cursor-pointer"
          >
            Marcar como <span className="text-[var(--neon-yellow)]">Lenda</span>
          </label>
        </div>

        {/* Media Upload */}
        <div className="space-y-3">
          <label className="font-[var(--font-display)] text-sm text-[var(--text-secondary)] uppercase tracking-wider block">
            Provas do Crime
          </label>
          <p className="text-xs text-[var(--text-muted)] font-[var(--font-body)]">
            Fotos e videos que comprovem a mamacada
          </p>
          <MediaUpload
            onFilesChange={handleFilesChange}
            existingFiles={media}
            maxFiles={10}
          />
        </div>

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
            {mode === 'edit' ? 'Salvar Alteracoes' : 'Publicar Mamacada'}
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
