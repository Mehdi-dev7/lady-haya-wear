import { type SchemaTypeDefinition } from "sanity";
import category from "./category";
// import product from "./product"; // Ancien système - désactivé
// import productDetail from "./productDetail"; // Ancien système - désactivé
import productUnified from "./productUnified";

export const schema: { types: SchemaTypeDefinition[] } = {
	types: [category, productUnified],
};
