export default function CreatePost() {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-softGray space-y-4">
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full bg-softGray" /> {/* Avatar Placeholder */}
        <input 
          type="text" 
          placeholder="What's on your mind, Neighbor?" 
          className="flex-1 bg-background border-none rounded-full px-5 focus:ring-1 ring-primary/20"
        />
      </div>
      <hr className="border-softGray" />
      <div className="flex justify-between items-center text-xs font-semibold text-darkText/70">
        <div className="flex gap-4">
          <button className="flex items-center gap-1 hover:text-primary transition">📷 Photo/Video</button>
          <button className="flex items-center gap-1 hover:text-primary transition">😊 Feeling/Activity</button>
        </div>
        <button className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition">Post</button>
      </div>
    </div>
  );
}