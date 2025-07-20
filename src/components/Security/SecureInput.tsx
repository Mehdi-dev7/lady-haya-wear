"use client";

import { sanitizeInput } from "@/lib/security";
import React, { useState } from "react";

interface SecureInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	error?: string;
	onValidationChange?: (isValid: boolean) => void;
	validationRules?: {
		required?: boolean;
		minLength?: number;
		maxLength?: number;
		pattern?: RegExp;
		customValidation?: (value: string) => string | null;
	};
}

export function SecureInput({
	label,
	error,
	onValidationChange,
	validationRules = {},
	onChange,
	onBlur,
	...props
}: SecureInputProps) {
	const [value, setValue] = useState("");
	const [validationError, setValidationError] = useState<string>("");
	const [isTouched, setIsTouched] = useState(false);

	const validate = (inputValue: string): string => {
		const sanitizedValue = sanitizeInput(inputValue);

		// Validation requise
		if (validationRules.required && !sanitizedValue.trim()) {
			return "Ce champ est requis";
		}

		// Validation longueur minimale
		if (
			validationRules.minLength &&
			sanitizedValue.length < validationRules.minLength
		) {
			return `Minimum ${validationRules.minLength} caractères`;
		}

		// Validation longueur maximale
		if (
			validationRules.maxLength &&
			sanitizedValue.length > validationRules.maxLength
		) {
			return `Maximum ${validationRules.maxLength} caractères`;
		}

		// Validation pattern
		if (
			validationRules.pattern &&
			sanitizedValue &&
			!validationRules.pattern.test(sanitizedValue)
		) {
			return "Format invalide";
		}

		// Validation personnalisée
		if (validationRules.customValidation) {
			const customError = validationRules.customValidation(sanitizedValue);
			if (customError) return customError;
		}

		return "";
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = e.target.value;
		setValue(newValue);

		// Validation en temps réel après le premier focus
		if (isTouched) {
			const error = validate(newValue);
			setValidationError(error);
			onValidationChange?.(!error);
		}

		// Appeler le onChange original
		onChange?.(e);
	};

	const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
		setIsTouched(true);
		const error = validate(e.target.value);
		setValidationError(error);
		onValidationChange?.(!error);
		onBlur?.(e);
	};

	const finalError = error || validationError;
	const hasError = !!finalError && isTouched;

	return (
		<div className="w-full">
			{label && (
				<label className="block text-nude-dark-2 text-lg mb-2 font-balqis">
					{label}
				</label>
			)}
			<input
				{...props}
				value={value}
				onChange={handleChange}
				onBlur={handleBlur}
				className={`h-14 rounded-xl bg-beige-light backdrop-blur-sm px-4 w-full border-2 transition-all duration-300 text-lg text-gray-400 [&:-webkit-autofill]:bg-beige-light [&:-webkit-autofill]:text-gray-400 [&:-webkit-autofill]:shadow-[0_0_0_30px_#f5f5dc_inset] ${
					hasError
						? "border-red-400 focus:border-red-500"
						: "border-nude-light focus:border-rose-200"
				} focus:outline-none`}
			/>
			{hasError && <p className="text-red-500 text-sm mt-2">{finalError}</p>}
		</div>
	);
}

// Composants spécialisés
export function SecureEmailInput(
	props: Omit<SecureInputProps, "type" | "validationRules">
) {
	return (
		<SecureInput
			{...props}
			type="email"
			validationRules={{
				required: true,
				pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
				customValidation: (value) => {
					if (!value) return null;
					if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
						return "Format d'email invalide";
					}
					return null;
				},
			}}
		/>
	);
}

export function SecureNameInput(
	props: Omit<SecureInputProps, "validationRules">
) {
	return (
		<SecureInput
			{...props}
			validationRules={{
				required: true,
				minLength: 2,
				maxLength: 50,
				pattern: /^[a-zA-ZÀ-ÿ\s'-]+$/,
				customValidation: (value) => {
					if (!value) return null;
					if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(value)) {
						return "Caractères non autorisés";
					}
					return null;
				},
			}}
		/>
	);
}

export function SecurePhoneInput(
	props: Omit<SecureInputProps, "validationRules">
) {
	return (
		<SecureInput
			{...props}
			validationRules={{
				required: true,
				pattern: /^[\d\s+\-\(\)]+$/,
				maxLength: 20,
				customValidation: (value) => {
					if (!value) return null;
					const digitsOnly = value.replace(/\D/g, "");
					if (digitsOnly.length < 10 || digitsOnly.length > 15) {
						return "Numéro de téléphone invalide";
					}
					return null;
				},
			}}
		/>
	);
}
