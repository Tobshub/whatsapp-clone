export default function genId(type?: "user" | "chat") {
  const random = crypto.randomUUID();
  const id = "wa" + `${type === "chat" ? "c" : "u"}` + random.slice(0, 15);
  return id;
}
