export default function Filter() {
	return (
		<div className="my-12 flex justify-between">
			<div className="flex gap-6 flex-wrap">
				<select
					name="type"
					id=""
					className="py-2 px-4 rounded-2xl text-xs font-medium bg-gray-200"
				>
					<option>Type</option>
					<option value="Physical">Physical</option>
					<option value="Digital">Digital</option>
				</select>
				<input
					type="text"
					name="min"
					placeholder="min price"
					className="text-xs rounded-2xl p-2 w-24 ring-1 ring-gray-400"
				/>
				<input
					type="text"
					name="max"
					placeholder="max price"
					className="text-xs rounded-2xl p-2 w-24 ring-1 ring-gray-400"
				/>

				<select
					name="size"
					id=""
					className="py-2 px-4 rounded-2xl text-xs font-medium bg-gray-200"
				>
					<option>Size</option>
					<option value="">Size</option>
				</select>
				<select
					name="color"
					id=""
					className="py-2 px-4 rounded-2xl text-xs font-medium bg-gray-200"
				>
					<option>Colors</option>
					<option value="">Colors</option>
				</select>
				<select
					name=""
					id=""
					className="py-2 px-4 rounded-2xl text-xs font-medium bg-gray-200"
				>
					<option>Categories</option>
					<option value="Physical">New Arrivals</option>
					<option value="Digital">Popular</option>
				</select>
				<select
					name=""
					id=""
					className="py-2 px-4 rounded-2xl text-xs font-medium bg-gray-200"
				>
					<option>All Filters</option>
					
				</select>
			</div>
			<div className="">
        <select name="" id="" className="py-2 px-4 rounded-2xl text-xs font-medium bg-white ring-1 ring-gray-400">
          <option>Sort By</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>

      </div>
		</div>
	);
}
