export default function CustomizeProducts() {
	return (
		<div className="flex flex-col gap-6">
			<h4 className="font-medium">Couleurs</h4>
			<ul className="flex items-center gap-3">
				<li className="w-8 h-8 rounded-full ring-1 ring-gray-300 cursor-pointer relative bg-red-500">
					<div className="absolute w-10 h-10 rounded-full ring-2 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
				</li>
				<li className="w-8 h-8 rounded-full ring-1 ring-gray-300 cursor-pointer relative bg-blue-500"></li>
				<li className="w-8 h-8 rounded-full ring-1 ring-gray-300 cursor-not-allowed relative bg-purple-500">
          <div className="absolute w-10 h-[2px] bg-red-400 rotate-45 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </li>
			</ul>
			<h4 className="font-medium">Tailles</h4>
			<ul className="flex items-center gap-3">
        <li className="ring-1 ring-red-400 text-red-400 rounded-md py-1 px-4 text-sm cursor-pointer">S</li>
        <li className="ring-1 ring-red-400 text-white bg-red-400 rounded-md py-1 px-4 text-sm cursor-pointer">M</li>
        <li className="ring-1 ring-red-400 text-red-400 rounded-md py-1 px-4 text-sm cursor-pointer">L</li>
        <li className="ring-1 ring-pink-200 text-white bg-pink-200 rounded-md py-1 px-4 text-sm cursor-not-allowed">XL</li>
      </ul>
		</div>
	);
}
