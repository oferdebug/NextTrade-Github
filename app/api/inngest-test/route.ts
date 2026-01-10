import {NextResponse} from "next/server";
import {inngest} from "@/inngest/client";

/**
 * Handle POST requests by emitting an "app/user.created" event to Inngest and returning a success response.
 *
 * @returns A JSON HTTP response with `{ ok: true }`.
 */
export async function POST() {
    await inngest.send({
        name: "app/user.created",
        data: {
            email: "[email protected]",
            country: "Israel",
            investmentGoals: "Growth",
            riskTolerance: "Medium",
            preferredIndustry: "Tech",
        },
    });

    return NextResponse.json({ok: true});
}