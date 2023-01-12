export default function genId() {
  const random = crypto.randomUUID();
  const id = "wa" + random.slice(2, 15);
  return id;
}
