class Toast {
	constructor({position = "bottom-center", duration = 3000, maxVisible = 3} = {}) {
		this.duration = duration;
		this.maxVisible = maxVisible;

		this.queue = [];
		this.active = new Set();

		this.container = document.createElement("div");
		this.container.className = `toast-container toast-${position}`;
		document.body.appendChild(this.container);
	}

	_enqueue(message, type, duration) {
		const toastData = {message, type, duration};
		this.queue.push(toastData);
		this._processQueue();
	}

	_processQueue() {
		if (this.active.size >= this.maxVisible) return;
		if (!this.queue.length) return;

		const {message, type, duration} = this.queue.shift();
		this._show(message, type, duration);
	}

	_show(message, type, duration) {
		const toast = document.createElement("div");
		toast.className = `toast ${type}`;
		toast.textContent = message;

		this.container.appendChild(toast);
		this.active.add(toast);

		requestAnimationFrame(() => {
			toast.classList.add("show");
		});

		const timeout = setTimeout(() => {
			this._remove(toast);
		}, duration || this.duration);

		return {
			dismiss: () => {
				clearTimeout(timeout);
				this._remove(toast);
			}
		};
	}

	_remove(toast) {
		if (!this.active.has(toast)) return;

		toast.classList.remove("show");

		setTimeout(() => {
			toast.remove();
			this.active.delete(toast);
			this._processQueue(); //
		}, 220);
	}

	success(msg, duration) {
		this._enqueue(msg, "success", duration);
	}

	error(msg, duration) {
		this._enqueue(msg, "error", duration);
	}

	info(msg, duration) {
		this._enqueue(msg, "info", duration);
	}
}


const _toast = new Toast({
	position: "bottom-center",
	duration: 1500,
	maxVisible: 3
});

export const info = (message) => _toast.info(message);
export const success = (message) => _toast.success(message);
export const error = (message) => _toast.error(message);
