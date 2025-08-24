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
		const newToast: ToastMessage = {
			id,
			duration: 5000,
			...toast
		};

		toastStore.update((toasts) => [...toasts, newToast]);

		// Auto-remove après la durée spécifiée
		if (newToast.duration && newToast.duration > 0) {
			setTimeout(() => {
				toastActions.remove(id);
			}, newToast.duration);
		}

		return id;
	},

	// Supprimer une notification
	remove: (id: string) => {
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
	return toastActions.add({ type, message, duration });
}
