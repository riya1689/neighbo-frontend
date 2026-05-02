import { ImageIcon, Smile, MapPin } from 'lucide-react';
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
            <div className="flex justify-between items-center text-xs font-bold text-dark-text/60">
                <div className="flex gap-5">
                    <button className="flex items-center gap-2 hover:text-primary transition">
                        <ImageIcon size={18} className="text-accent-green" /> Photo/Video
                    </button>
                    <button className="flex items-center gap-2 hover:text-primary transition">
                        <Smile size={18} className="text-primary" /> Feeling
                    </button>
                    <button className="flex items-center gap-2 hover:text-primary transition">
                        <MapPin size={18} className="text-accent-red" /> Check In
                    </button>
                </div>
                <button className="bg-primary text-white px-8 py-2.5 rounded-xl font-bold hover:bg-primary-dark transition shadow-lg shadow-primary/20">
                   Create Post
                </button>
            </div>


        </div>
    );
}