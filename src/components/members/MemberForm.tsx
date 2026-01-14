'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button, Input, Textarea } from '@/components/ui';
import { useMemberStore } from '@/stores/member-store';
import { useMamacoConfirmation } from '@/hooks/useMamacoConfirmation';
import type { Member } from '@/types/story';

const memberSchema = z.object({
  name: z
    .string()
    .min(2, 'O nome deve ter pelo menos 2 caracteres')
    .max(100, 'O nome deve ter no maximo 100 caracteres'),
  nickname: z
    .string()
    .min(2, 'O apelido deve ter pelo menos 2 caracteres')
    .max(50, 'O apelido deve ter no maximo 50 caracteres'),
  bio: z
    .string()
    .max(500, 'A bio deve ter no maximo 500 caracteres')
    .optional(),
  role: z
    .string()
    .max(100, 'O cargo deve ter no maximo 100 caracteres')
    .optional(),
});

type MemberFormData = z.infer<typeof memberSchema>;

interface MemberFormProps {
  initialData?: Partial<Member>;
  mode?: 'create' | 'edit';
}

export function MemberForm({ initialData, mode = 'create' }: MemberFormProps) {
  const router = useRouter();
  const { createMember, updateMember } = useMemberStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(initialData?.avatar || '');
  const [isUploading, setIsUploading] = useState(false);

  const { confirm, MamacoComponents } = useMamacoConfirmation({
    successMessage: mode === 'edit' ? 'MEMBRO EDITADO!!!' : 'NOVO DEPENADO!!!',
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MemberFormData>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      name: initialData?.name || '',
      nickname: initialData?.nickname || '',
      bio: initialData?.bio || '',
      role: initialData?.role || '',
    },
  });

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('files', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setAvatarUrl(data.files[0].url);
      }
    } catch (error) {
      console.error('Erro no upload:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const executeSubmit = async (data: MemberFormData) => {
    setIsSubmitting(true);

    try {
      const memberData = {
        name: data.name,
        nickname: data.nickname,
        bio: data.bio,
        role: data.role,
        avatar: avatarUrl || undefined,
      };

      if (mode === 'edit' && initialData?.id) {
        await updateMember(initialData.id, memberData);
      } else {
        await createMember(memberData);
      }

      setTimeout(() => {
        router.push('/membros');
      }, 2800);
    } catch (error) {
      console.error('Erro ao salvar membro:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = (data: MemberFormData) => {
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
        {/* Avatar Upload */}
        <div className="space-y-3">
          <label className="font-[var(--font-display)] text-sm text-[var(--text-secondary)] uppercase tracking-wider block">
            Foto de Perfil
          </label>
          <div className="flex items-center gap-6">
            <div className="relative w-32 h-32 border-2 border-[var(--surface-elevated)] overflow-hidden">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-[var(--surface-dark)] flex items-center justify-center">
                  <svg className="w-12 h-12 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
              {isUploading && (
                <div className="absolute inset-0 bg-[var(--void-black)]/80 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-[var(--neon-green)] border-t-transparent rounded-full spinner-chaos" />
                </div>
              )}
            </div>
            <div>
              <label className="cursor-pointer">
                <span className="inline-block px-4 py-2 bg-[var(--surface-card)] border border-[var(--neon-green)] text-[var(--neon-green)] font-[var(--font-display)] text-sm uppercase tracking-wider hover:bg-[var(--neon-green)]/10 transition-colors">
                  {avatarUrl ? 'Trocar Foto' : 'Enviar Foto'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
              <p className="text-xs text-[var(--text-muted)] mt-2">
                JPG, PNG ou WebP
              </p>
            </div>
          </div>
        </div>

        {/* Name */}
        <Input
          label="Nome Real"
          placeholder="O nome que a mae conhece"
          error={errors.name?.message}
          {...register('name')}
        />

        {/* Nickname */}
        <Input
          label="Apelido de Guerra"
          placeholder="Como os depenados te chamam"
          error={errors.nickname?.message}
          {...register('nickname')}
        />

        {/* Role */}
        <Input
          label="Cargo na Irmandade (opcional)"
          placeholder="Ex: O Bebado Mor, O Contador de Historias"
          error={errors.role?.message}
          {...register('role')}
        />

        {/* Bio */}
        <Textarea
          label="Bio (opcional)"
          placeholder="Uma descricao epica deste depenado..."
          hint="Conte a lenda por tras do apelido"
          rows={4}
          error={errors.bio?.message}
          {...register('bio')}
        />

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
            {mode === 'edit' ? 'Salvar Alteracoes' : 'Adicionar Membro'}
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
