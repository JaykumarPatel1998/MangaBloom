import { AppSidebar } from "./components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "./components/ui/navigation-menu";

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { BrowserRouter, Routes, Route } from "react-router";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools"
import Homepage from "@/pages/HomePage";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { indexedDBPersister } from "./lib/indexedDbPersister";
import { Analytics } from "@vercel/analytics/react"
import MangaPage from "./pages/MangaPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60 * 24,
      retry: false, // Do not retry when offline
      refetchOnReconnect: false, // Prevent unnecessary network calls when reconnected
      refetchOnWindowFocus: false, // Avoid refetching when focusing the browser window
    },
  },
});

// persist the query client
persistQueryClient({
  queryClient : queryClient,
  persister: indexedDBPersister
})

function App() {
  return (
    <SidebarProvider
      defaultOpen={true}
    >
      <Analytics/>
      <AppSidebar />

      <div className="w-full">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <SidebarTrigger />
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>


        <QueryClientProvider client={queryClient}>

          <ReactQueryDevtools initialIsOpen={false}/>

          <BrowserRouter>
            <Routes>
              <Route index element={<Homepage/>} />
              <Route path="manga">
                <Route path=":id" element={<MangaPage />} />
              </Route>
            </Routes>
          </BrowserRouter>

        </QueryClientProvider>

        <footer>
          <p>Powered by <a href="https://mangadex.org" target="_blank" rel="noreferrer">mangadex.org</a></p>
          <img src="https://mangadex.org/img/brand/mangadex-wordmark.svg" alt="mangadex logo" className="w-[300px] bg-[#e0795f]"/>
        </footer>
      </div>
    </SidebarProvider>
  );
}

export default App;
