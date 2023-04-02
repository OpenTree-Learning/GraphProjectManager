import { toast } from 'react-toastify';


export const notify = (message: string, status: 'success' | 'error') => {
	const toastFunction = toast[status];

	toastFunction(message, {
		position: "top-center",
		autoClose: 4000,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
		theme: "light"
	});
};
