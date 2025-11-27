import Image from "next/image";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

type UserCardProps = {
  type: string;
  value: number;
  change: number; // increase/decrease in 20 days
};

const UserCard = ({ type, value, change }: UserCardProps) => {
  const isPositive = change >= 0;

  return (
    <div className="rounded-2xl odd:bg-[#CFCEFF] even:bg-[#FAE27C] p-4 flex-1 min-w-[130px]">
      {/* Top Row */}
      <div className="flex justify-between items-center">
        <span className="text-[10px] bg-white px-2 py-1 rounded-full text-green-600">
          2024/25
        </span>
        <Image src="/more.png" alt="more" width={20} height={20} />
      </div>

      {/* Main Value */}
      <h1 className="text-2xl font-semibold my-4">{value.toLocaleString()}</h1>
      <h2 className="capitalize text-sm font-medium text-gray-600">{type}</h2>

      {/* Change Indicator */}
      <div className="flex items-center gap-1 mt-2 text-xs">
        {isPositive ? (
          <ArrowUpRight className="w-4 h-4 text-green-600" />
        ) : (
          <ArrowDownRight className="w-4 h-4 text-red-600" />
        )}
        <span className={isPositive ? "text-green-600" : "text-red-600"}>
          {isPositive ? `+${change}` : change} in 20 days
        </span>
      </div>
    </div>
  );
};

export default UserCard;
