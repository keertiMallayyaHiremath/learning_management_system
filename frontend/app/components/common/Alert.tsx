export default function Alert({ message }: { message: string }) {
  return <div className="p-2 bg-red-200 text-red-800">{message}</div>;
}