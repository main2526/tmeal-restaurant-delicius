import { RestaurantMenu } from "@/features/restaurant-menu/components/restaurant-menu";
import { isValidTableAccess } from "@/lib/table-access";

export default async function HomePage({ searchParams }: PageProps<"/">) {
  const query = await searchParams;
  const table = typeof query.mesa === "string" ? query.mesa : "";
  const token = typeof query.token === "string" ? query.token : "";
  const tableAccess = isValidTableAccess(table, token) ? { table, token } : null;

  return <RestaurantMenu tableAccess={tableAccess} />;
}
