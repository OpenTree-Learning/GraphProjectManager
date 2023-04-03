export const cutString = (
	str: string, 
	cutPosition: number
): string => {
	if (str.length <= cutPosition) {
		return str;
	}

	const cut = (cutPosition >= 0 && cutPosition < str.length) ? str.slice(0, cutPosition) : str;

	return `${cut}...`;
};


export const capitalize = (
	role: string
): string => {
	return role.charAt(0).toUpperCase() + 
	       role.slice(1).toLowerCase();
};

