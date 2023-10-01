export default function Plunderswap() {
  return (
    <div className="pt-8 pb-2 md:pb-8">
      <div className="flex flex-col lg:flex-row items-start">
        <div className="flex-grow">
          <h2 className="mb-1">Welcome pirate</h2>
          <div className="text-gray-500 dark:text-gray-400 text-lg">
            From the shipcrew of PlunderSwap
          </div>

          <div className="mt-6">
            <img src="https://plunderswap.b-cdn.net/donkey.png" />
          </div>

          <div className="text-sm mt-8">
            Don't forget to join the shipcrew by{" "}
            <a
              href="https://stake.plunderswap.com"
              className="underline font-medium"
            >
              staking at PlunderSwap SSN
            </a>
            .
          </div>
        </div>
      </div>
    </div>
  );
}
