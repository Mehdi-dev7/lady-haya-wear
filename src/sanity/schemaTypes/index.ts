import { type SchemaTypeDefinition } from "sanity";
import category from "./category";
import product from "./product";
import productDetail from "./productDetail";

export const schema: { types: SchemaTypeDefinition[] } = {
	types: [category, product, productDetail],
};
