import { type SchemaTypeDefinition } from "sanity";
import category from "./category";
import product from "./product";
import productDetail from "./productDetail";
import productUnified from "./productUnified";

export const schema: { types: SchemaTypeDefinition[] } = {
	types: [category, productUnified, product, productDetail],
};
