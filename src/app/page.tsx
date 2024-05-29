import Image from "next/image";
import Link from "next/link";
import postman from '/public/postman.svg'

export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			<div className="w-fullitems-center flex flex-col gap-8">
				<p className=" dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
					This is a&nbsp;<span className="font-mono font-bold">backend</span>
					-only project!
				</p>
				<p className=" dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
					Use `Postman` / other API testing client app of your choice.
				</p>
				<Link
					href="https://god.gw.postman.com/run-collection/16795231-e42afeaa-bac8-4bfc-be18-6a56c0ac1ed0?action=collection%2Ffork&source=rip_markdown&collection-url=entityId%3D16795231-e42afeaa-bac8-4bfc-be18-6a56c0ac1ed0%26entityType%3Dcollection%26workspaceId%3D3820021f-98e1-46a2-bbd3-952b25811fa4"
					replace={true}
					target="_blank"
				>
					<Image
						src={postman}
						alt="Run In Postman"
						className="hover:cursor-pointer"
						width={128}
						height={32}
					/>
				</Link>
			</div>
		</main>
	);
}
