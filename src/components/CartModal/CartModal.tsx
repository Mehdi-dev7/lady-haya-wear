"use client";
import Image from "next/image";
import React from "react";

export default function CartModal() {
	const cartItems = true;

	return (
		<div className="absolute w-max top-12 right-0 p-4 rounded-md shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-white flex flex-col gap-6 z-20">
			{!cartItems ? (
				<div>Your cart is empty</div>
			) : (
				<>
					<h2 className="text-xl">Shopping Cart</h2>
					<div className="flex flex-col gap-8">
						{/* ITEMS */}
						<div className="flex gap-4">
							<Image
								src="/assets/grid/img1.jpeg"
								alt="Cart"
								width={72}
								height={96}
								className="object-cover rounded-md"
							/>
							<div className="flex flex-col justify-between w-full">
								{/* TOP */}
								<div className="">
									{/* TITLE */}
									<div className="flex items-center justify-between gap-8">
										<h3 className="font-semibold ">Product Name</h3>
										<div className="p-1 bg-gray-100 rounded-sm">$49</div>
									</div>

									{/* DESC */}
									<div className="text-sm text-gray-500">avaible</div>
								</div>

								{/* BOTTOM */}
								<div className="flex justify-between text-sm">
									<span className="text-gray-500">Qty. 2</span>
									<span className="text-blue-500">Remove</span>
								</div>
							</div>
						</div>
					</div>
					{/* BOTTOM */}
					<div className="">
						<div className="flex items-center justify-between font-semibold">
							<span className="">Subtotal</span>
							<span className="">$49</span>
						</div>
            <p className="text-gray-500 text-sm mt-2 mb-4">Lorem ipsum dolor sit amet.</p>
            <div className="flex justify-between text-sm">
              <button className="rounded-md py-3 px-4 ring-1 ring-gray-300">View Cart</button>
              <button className="rounded-md py-3 px-4 bg-black text-white">Checkout</button>
            </div>
					</div>
				</>
			)}
		</div>
	);
}
