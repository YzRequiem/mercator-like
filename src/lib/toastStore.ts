// Store pour gérer les notifications toast
import { writable } from 'svelte/store';

export interface ToastMessage {
	id: string;
	type: 'success' | 'error' | 'warning' | 'info';
	message: string;
	duration?: number;
}

export const toastStore = writable<ToastMessage[]>([]);

export const toastActions = {
	// Ajouter une notification
	add: (toast: Omit<ToastMessage, 'id'>) => {
		const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
		// IMPORTANT: spread d'abord puis appliquer la durée par défaut, sinon une valeur undefined écrase la valeur par défaut
		const newToast: ToastMessage = {
			id,
			...toast,
			duration: toast.duration ?? 3000 // 3 secondes par défaut si non fourni
		};

		console.log('Adding toast:', newToast); // Debug

		toastStore.update((toasts) => [...toasts, newToast]);

		// Auto-remove après la durée spécifiée
		if (newToast.duration && newToast.duration > 0) {
			console.log(`Setting timeout for ${newToast.duration}ms`); // Debug
			setTimeout(() => {
				console.log('Auto-removing toast:', id); // Debug
				toastActions.remove(id);
			}, newToast.duration);
		}

		return id;
	},

	// Supprimer une notification
	remove: (id: string) => {
		console.log('Removing toast:', id); // Debug
		toastStore.update((toasts) => toasts.filter((toast) => toast.id !== id));
	},

	// Méthodes de convenance
	success: (message: string, duration?: number) =>
		toastActions.add({ type: 'success', message, duration }),

	error: (message: string, duration?: number) =>
		toastActions.add({ type: 'error', message, duration }),

	warning: (message: string, duration?: number) =>
		toastActions.add({ type: 'warning', message, duration }),

	info: (message: string, duration?: number) =>
		toastActions.add({ type: 'info', message, duration }),

	// Effacer toutes les notifications
	clear: () => {
		toastStore.set([]);
	}
};

// Fonction d'aide pour ajouter facilement une toast
export function addToast(
	message: string,
	type: 'success' | 'error' | 'warning' | 'info' = 'info',
	duration?: number
) {
	return toastActions.add({ type, message, ...(duration && { duration }) });
}
