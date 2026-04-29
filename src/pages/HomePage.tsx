export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center text-gray-500">
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
        onClick={() => {
          fetch('/api').then(res => {
            console.log(res);
          }).catch(err => {
            console.error(err);
          });
        }}
      >
        打开助手
      </button>
    </div>
  );
}
