import { FlatCompat } from "@eslint/eslintrc";
import nextConfig from "eslint-config-next";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: { ...nextConfig },
});

const eslintConfig = [
	...compat.extends("next/core-web-vitals"),
	{
		rules: {
			"@typescript-eslint/no-explicit-any": "off",
			"import/no-anonymous-default-export": "off",
			"prefer-const": "off",
			"react/no-unescaped-entities": "off",
		},
	},
];

export default eslintConfig;
