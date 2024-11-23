import { AppSidebar } from "./components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./components/ui/navigation-menu";

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { BrowserRouter } from "react-router";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools"
import Homepage from "@/pages/HomePage";

const queryClient = new QueryClient()

function App() {
  return (
    <SidebarProvider
      defaultOpen={true}
    >
      <AppSidebar />

      <div className="container">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <SidebarTrigger />
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink href="#">| Link 1</NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink href="#">| Link 2 |</NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
              <NavigationMenuContent>
                <NavigationMenuLink>Link</NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>


        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools/>
          <BrowserRouter>
            <Homepage/>
          </BrowserRouter>
        </QueryClientProvider>
        
        
      </div>
    </SidebarProvider>
  );
}

export default App;
