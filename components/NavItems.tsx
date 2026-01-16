'use client';
import Link from "next/link";
import {usePathname} from "next/navigation";
import {NAV_ITEMS} from "@/lib/constants"; // or '@/constants'
import {cn} from "@/lib/utils";
import {SearchCommand} from "@/components/SearchCommand";
import {Star} from "lucide-react";

/* SENIOR NOTE:
   Added 'className' prop to make the component reusable in different contexts
   (e.g., Header horizontal menu vs. a Dropdown vertical menu).
*/
const NavItems = ({initialStocks, className}: { initialStocks: StockWithWatchlistStatus[]; className?: string }) => {
    const pathname = usePathname();

    const isActive = (path: string) => {
        return pathname === path;
    };

    return (
        <ul
            className={cn(
                // We want a tight flex row, no extra width
                "flex items-center gap-6 font-medium w-auto",
                className
            )}>
            {NAV_ITEMS.map(({href, label}) => {
                if (label === "Search")
                    return (
                        <li key="search-trigger">
                            <SearchCommand
                                renderAs={"text"}
                                label={"Search"}
                                initialStocks={initialStocks}
                            />
                        </li>
                    );
                return (
                    <li key={href}>
                        <Link
                            href={href}
                            className={cn(
                                "transition-colors flex items-center gap-1.5",
                                isActive(href)
                                    ? "text-green-500"
                                    : "text-white hover:text-green-500"
                            )}>
                            {label === "Watchlist" && <Star className="h-4 w-4"/>}
                            {label}
                        </Link>
                    </li>
                );
            })}
        </ul>
    );
};
export default NavItems;