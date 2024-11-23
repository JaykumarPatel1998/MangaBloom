import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu } from "@/components/ui/sidebar";

const genres = [
{title : "Action", url: "#"},
{title : "Adventure", url: "#"},
{title : "Boys' Love", url: "#"},
{title : "Comedy", url: "#"},
{title : "Crime", url: "#"},
{title : "Drama", url: "#"},
{title : "Fantasy", url: "#"},
{title : "Girls' Love", url: "#"},
{title : "Historical", url: "#"},
{title : "Horror", url: "#"},
{title : "Isekai", url: "#"},
{title : "Magical Girls", url: "#"},
{title : "Mecha", url: "#"},
{title : "Medical", url: "#"},
{title : "Mystery", url: "#"},
{title : "Philosophical", url: "#"},
{title : "Psychological", url: "#"},
{title : "Romance", url: "#"},
{title : "Sci-Fi", url: "#"},
{title : "Slice of Life", url: "#"},
{title : "Sports", url: "#"},
{title : "Superhero", url: "#"},
{title : "Thriller", url: "#"},
{title : "Tragedy", url: "#"},
{title : "Wuxia", url: "#"},
]

const themes = [
{title: "Aliens", url: "#"},
{title: "Animals", url: "#"},
{title: "Cooking", url: "#"},
{title: "Crossdressing", url: "#"},
{title: "Delinquents", url: "#"},
{title: "Demons", url: "#"},
{title: "Genderswap", url: "#"},
{title: "Ghosts", url: "#"},
{title: "Gyaru", url: "#"},
{title: "Harem", url: "#"},
{title: "Incest", url: "#"},
{title: "Loli", url: "#"},
{title: "Mafia", url: "#"},
{title: "Magic", url: "#"},
{title: "Martial Arts", url: "#"},
{title: "Military", url: "#"},
{title: "Monster Girls", url: "#"},
{title: "Monsters", url: "#"},
{title: "Music", url: "#"},
{title: "Ninja", url: "#"},
{title: "Office Workers", url: "#"},
{title: "Police", url: "#"},
{title: "Post-Apocalyptic", url: "#"},
{title: "Reincarnation", url: "#"},
{title: "Reverse Harem", url: "#"},
{title: "Samurai", url: "#"},
{title: "School Life", url: "#"},
{title: "Shota", url: "#"},
{title: "Supernatural", url: "#"},
{title: "Survival", url: "#"},
{title: "Time Travel", url: "#"},
{title: "Traditional Games", url: "#"},
{title: "Vampires", url: "#"},
{title: "Video Games", url: "#"},
{title: "Villainess", url: "#"},
{title: "Virtual Reality", url: "#"},
{title: "Zombies", url: "#"},
]

export function AppSidebar() {
    return (
        <Sidebar>
            <SidebarHeader className="text-lg mx-auto font-bold bg-background">Manga Bloom</SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="text-foreground text-lg bg-[hsl(var(--primary)/0.3)] w-max my-4">#Pick Your Poison</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="grid grid-cols-3 gap-4 text-muted-foreground font-semibold px-2">
                            {genres.map((item) => (
                                    <a href={item.url} key={item.title}>
                                        <span>{item.title}</span>
                                    </a>
                            ))}
                            
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel className="text-foreground text-lg bg-[hsl(var(--primary)/0.3)] w-max my-4">#Category</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="grid grid-cols-3 gap-4 text-muted-foreground font-semibold px-2">
                            {themes.map((item) => (
                                    <a href={item.url} key={item.title}>
                                        <span>{item.title}</span>
                                    </a>
                            ))}
                            
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>


                {/* for the future */}
                {/* <SidebarGroup>
                    <SidebarGroupLabel>Pick Your Poison</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <SidebarMenuButton accessKey="H" className="flex justify-center py-6">
                                            <span className="font-semibold">Pick Your Poison</span>
                                            <span className="text-muted-foreground bg-[hsl(var(--primary)/0.1)] p-2 rounded-sm">Alt+H</span>
                                            <ChevronDown/>
                                        </SidebarMenuButton>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-[--radix-popper-anchor-width] text-center" defaultChecked={true}>
                                        {
                                            genres.map((genre) => (
                                                <DropdownMenuItem key={genre.title} className="hover:border-2 hover:border-muted-foreground py-4">
                                                    <a href={genre.url} className="font-semibold text-muted-foreground tracking-widest">
                                                        <span>{genre.title}</span>
                                                    </a>
                                                </DropdownMenuItem>
                                            ))
                                        }
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </SidebarMenuItem>

                            {genres.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild>
                                    <a href={item.url}>
                                        <span>{item.title}</span>
                                    </a>
                                </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                            
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup> */}
            </SidebarContent>
        </Sidebar>
    )
}