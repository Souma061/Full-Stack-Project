import { useQuery } from "@tanstack/react-query";

export default function Test() {
  const { data, isLoading } = useQuery({
    queryKey: ["test"],
    queryFn: () => Promise.resolve("Hello World"),
  });

  return <h1>{isLoading ? "Loading..." : data}</h1>;
}
