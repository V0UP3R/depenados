'use client';

import { useState, useCallback, ReactNode } from 'react';
import { ConfirmationModal, ScreamingMonkey } from '@/components/ui';

interface UseMamacoConfirmationOptions {
  onSuccess?: () => void;
  successMessage?: string;
}

export function useMamacoConfirmation(options: UseMamacoConfirmationOptions = {}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showMonkey, setShowMonkey] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => Promise<void> | void) | null>(null);

  const confirm = useCallback((action: () => Promise<void> | void) => {
    setPendingAction(() => action);
    setIsModalOpen(true);
  }, []);

  const handleConfirm = useCallback(async () => {
    setIsModalOpen(false);
    if (pendingAction) {
      try {
        await pendingAction();
        // Show monkey animation on success
        setShowMonkey(true);
        options.onSuccess?.();
      } catch (error) {
        console.error('Erro na ação:', error);
      }
    }
    setPendingAction(null);
  }, [pendingAction, options]);

  const handleCancel = useCallback(() => {
    setIsModalOpen(false);
    setPendingAction(null);
  }, []);

  const handleMonkeyComplete = useCallback(() => {
    setShowMonkey(false);
  }, []);

  const MamacoComponents = useCallback((): ReactNode => (
    <>
      <ConfirmationModal
        isOpen={isModalOpen}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
      <ScreamingMonkey
        isVisible={showMonkey}
        onComplete={handleMonkeyComplete}
        message={options.successMessage || 'AAAAAHHHHH!!!'}
      />
    </>
  ), [isModalOpen, showMonkey, handleConfirm, handleCancel, handleMonkeyComplete, options.successMessage]);

  return {
    confirm,
    isConfirming: isModalOpen,
    MamacoComponents,
  };
}
