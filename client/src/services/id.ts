export default function genId(type?: "user" | "chat") {
  const random = crypto.randomUUID();
  const id = "wa" + `${type === "chat" ? "c" : "u"}` + random.slice(2, 15);
  return id;
}
