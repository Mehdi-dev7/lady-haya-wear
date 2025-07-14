// Expressions régulières pour la validation
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const NAME_REGEX = /^[a-zA-ZÀ-ÿ\s'-]+$/;
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;

// Fonctions de validation
export const validateEmail = (
	email: string
): { isValid: boolean; message: string } => {
	if (!email) {
		return { isValid: false, message: "Email requis" };
	}
	if (!EMAIL_REGEX.test(email)) {
		return { isValid: false, message: "Adresse email invalide" };
	}
	return { isValid: true, message: "" };
};

export const validatePassword = (
	password: string
): { isValid: boolean; message: string } => {
	if (!password) {
		return { isValid: false, message: "Mot de passe requis" };
	}
	if (password.length < 8) {
		return {
			isValid: false,
			message: "Le mot de passe doit contenir au moins 8 caractères",
		};
	}
	if (!PASSWORD_REGEX.test(password)) {
		return {
			isValid: false,
			message: "Le mot de passe doit contenir une maj et un chiffre",
		};
	}
	return { isValid: true, message: "" };
};

export const validateName = (
	name: string,
	fieldName: string
): { isValid: boolean; message: string } => {
	if (!name) {
		return { isValid: true, message: "" }; // Optionnel
	}
	if (name.length < 2) {
		return {
			isValid: false,
			message: `${fieldName} doit contenir au moins 2 lettres`,
		};
	}
	if (name.length > 50) {
		return {
			isValid: false,
			message: `${fieldName} ne peut pas dépasser 50 caractères`,
		};
	}
	if (!NAME_REGEX.test(name)) {
		return {
			isValid: false,
			message: `${fieldName} ne peut contenir que des lettres`,
		};
	}
	return { isValid: true, message: "" };
};

// Validation complète du formulaire d'inscription
export const validateRegisterForm = (data: {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
}) => {
	const emailValidation = validateEmail(data.email);
	const passwordValidation = validatePassword(data.password);
	const firstNameValidation = validateName(data.firstName, "Le prénom");
	const lastNameValidation = validateName(data.lastName, "Le nom");

	const errors: { [key: string]: string } = {};

	if (!emailValidation.isValid) {
		errors.email = emailValidation.message;
	}
	if (!passwordValidation.isValid) {
		errors.password = passwordValidation.message;
	}
	if (!firstNameValidation.isValid) {
		errors.firstName = firstNameValidation.message;
	}
	if (!lastNameValidation.isValid) {
		errors.lastName = lastNameValidation.message;
	}

	return {
		isValid: Object.keys(errors).length === 0,
		errors,
	};
};

// Validation en temps réel pour les champs
export const getFieldValidation = (fieldName: string, value: string) => {
	switch (fieldName) {
		case "email":
			return validateEmail(value);
		case "password":
			return validatePassword(value);
		case "firstName":
			return validateName(value, "Le prénom");
		case "lastName":
			return validateName(value, "Le nom");
		default:
			return { isValid: true, message: "" };
	}
};
