import Navbar from "@/components/layout/Navbar";
import SidebarLeft from "@/components/layout/SidebarLeft";
//import SidebarRight from "@/components/layout/SidebarRight";
import Hero from "@/components/home/Hero";
import CreatePost from "@/components/home/CreatePost";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background font-inter text-darkText">
      {/* --- NAVBAR --- */}
      <Navbar />

      <main className="container mx-auto max-w-7xl px-4 pt-20">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          
          {/* --- LEFT SIDEBAR (3 cols) --- */}
          <aside className="hidden lg:block lg:col-span-3">
            <SidebarLeft />
          </aside>

          {/* --- MIDDLE MAIN SECTION (6 cols) --- */}
          <section className="col-span-1 lg:col-span-6 space-y-6">
            <Hero />
            <CreatePost />
            {/* Feed items will go here later */}
            <div className="p-10 text-center border-2 border-dashed border-softGray rounded-xl">
              Main Feed Content (Coming Soon)
            </div>
          </section>

          {/* --- RIGHT SIDEBAR (3 cols) --- */}
          {/* <aside className="hidden lg:block lg:col-span-3">
            <SidebarRight />
          </aside> */}

        </div>
      </main>
    </div>
  );
}