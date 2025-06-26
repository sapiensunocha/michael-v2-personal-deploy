"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Repeat, Share2, Search, RefreshCw, MoreHorizontal, Bookmark } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import type { JSX } from "react";
import { Pagination } from "@/components/pagination";

// Types for X posts
interface XPost {
  id: string
  author: {
    name: string
    handle: string
    verified: boolean
    avatar: string
  }
  content: string
  hashtags: string[]
  media?: {
    type: "image" | "video"
    url: string
  }[]
  timestamp: Date
  metrics: {
    likes: number
    comments: number
    reposts: number
    views: number
  }
}

// Generate sample disaster posts about the Thailand/Myanmar earthquake
function generateDisasterPosts(): XPost[] {
  const posts: XPost[] = [
    {
      id: "post-1",
      author: {
        name: "CNN Breaking News",
        handle: "cnnbrk",
        verified: true,
        avatar: "/placeholder.svg?height=40&width=40&text=CNN",
      },
      content:
        "The earthquake in Myanmar and Thailand was so powerful that unleashed energy equivalent to 334 atomic bombs, a geologist told CNN.",
      hashtags: [
        "geology",
        "science",
        "thailand",
        "bangkok",
        "myanmar",
        "earthquake",
        "cnn",
        "earth",
        "nature",
        "planet",
      ],
      media: [
        {
          type: "image",
          url: "/dummy.jpg",
        },
      ],
      timestamp: new Date(2024, 2, 22, 14, 30),
      metrics: {
        likes: 5243,
        comments: 842,
        reposts: 2184,
        views: 1200000,
      },
    },
    {
      id: "post-2",
      author: {
        name: "Breaking News",
        handle: "BreakingNews",
        verified: true,
        avatar: "/placeholder.svg?height=40&width=40&text=BN",
      },
      content:
        "#WATCH Bangkok window cleaner hangs on for his life halfway up swaying high-rise\n\nDangerously close to pool water streaming off building.\n\nHe's miraculously unhurt in Friday earthquake.",
      hashtags: ["earthquake", "Myanmar", "Mandalay", "bangkokearthquake", "MyanmarEarthquake"],
      media: [
        {
          type: "image",
          url: "/dummy.jpg",
        },
      ],
      timestamp: new Date(2024, 2, 22, 15, 45),
      metrics: {
        likes: 8721,
        comments: 1254,
        reposts: 4532,
        views: 2500000,
      },
    },
    {
      id: "post-3",
      author: {
        name: "Thailand News",
        handle: "ThailandNews",
        verified: true,
        avatar: "/placeholder.svg?height=40&width=40&text=TH",
      },
      content:
        "BREAKING: 6.4 magnitude earthquake strikes near Myanmar-Thailand border. Tremors felt in Bangkok. Buildings evacuated across the city.",
      hashtags: ["earthquake", "Thailand", "Myanmar", "Bangkok", "breaking"],
      timestamp: new Date(2024, 2, 22, 12, 15),
      metrics: {
        likes: 3254,
        comments: 521,
        reposts: 1876,
        views: 980000,
      },
    },
    {
      id: "post-4",
      author: {
        name: "Alex Thompson",
        handle: "alexthompson",
        verified: false,
        avatar: "/placeholder.svg?height=40&width=40&text=AT",
      },
      content:
        "Just experienced the scariest moment of my life. Our entire building in Bangkok was swaying for what felt like forever. Everyone rushed to the streets. Stay safe everyone.",
      hashtags: ["earthquake", "Bangkok", "Thailand", "scary"],
      timestamp: new Date(2024, 2, 22, 12, 25),
      metrics: {
        likes: 1243,
        comments: 342,
        reposts: 156,
        views: 45000,
      },
    },
    {
      id: "post-5",
      author: {
        name: "Weather Updates",
        handle: "WeatherUpdates",
        verified: true,
        avatar: "/placeholder.svg?height=40&width=40&text=WU",
      },
      content:
        "The 6.4 magnitude earthquake near the Myanmar-Thailand border occurred at a depth of 10km. Aftershocks expected in the coming days. No tsunami warning issued.",
      hashtags: ["earthquake", "Myanmar", "Thailand", "seismic", "aftershocks"],
      media: [
        {
          type: "image",
          url: "/placeholder.svg?height=300&width=500&text=Seismic+Activity",
        },
      ],
      timestamp: new Date(2024, 2, 22, 13, 10),
      metrics: {
        likes: 2187,
        comments: 321,
        reposts: 1432,
        views: 780000,
      },
    },
    {
      id: "post-6",
      author: {
        name: "Bangkok Post",
        handle: "BangkokPost",
        verified: true,
        avatar: "/placeholder.svg?height=40&width=40&text=BP",
      },
      content:
        "Several buildings in Bangkok show cracks after the earthquake. Authorities conducting safety inspections. No major structural damage reported so far.",
      hashtags: ["Bangkok", "earthquake", "safety", "Thailand", "buildings"],
      timestamp: new Date(2024, 2, 22, 16, 20),
      metrics: {
        likes: 1876,
        comments: 432,
        reposts: 765,
        views: 560000,
      },
    },
    {
      id: "post-7",
      author: {
        name: "Sarah Johnson",
        handle: "sarahjohnson",
        verified: false,
        avatar: "/placeholder.svg?height=40&width=40&text=SJ",
      },
      content:
        "My hotel in Chiang Mai is evacuating everyone. Staff saying it's just precautionary after the earthquake. Anyone know if there are aftershocks expected?",
      hashtags: ["ChiangMai", "Thailand", "earthquake", "travel", "help"],
      timestamp: new Date(2024, 2, 22, 12, 45),
      metrics: {
        likes: 543,
        comments: 231,
        reposts: 32,
        views: 28000,
      },
    },
    {
      id: "post-8",
      author: {
        name: "Disaster Relief",
        handle: "DisasterRelief",
        verified: true,
        avatar: "/placeholder.svg?height=40&width=40&text=DR",
      },
      content:
        "Teams being deployed to affected areas near the Myanmar-Thailand border. Initial reports suggest some villages have sustained damage. More updates to follow.",
      hashtags: ["Myanmar", "Thailand", "earthquake", "relief", "emergency"],
      timestamp: new Date(2024, 2, 22, 17, 30),
      metrics: {
        likes: 2543,
        comments: 187,
        reposts: 1243,
        views: 430000,
      },
    },
    {
      id: "post-9",
      author: {
        name: "Geology Today",
        handle: "GeologyToday",
        verified: true,
        avatar: "/placeholder.svg?height=40&width=40&text=GT",
      },
      content:
        "The Myanmar-Thailand earthquake occurred along a known fault line. This region has history of seismic activity, but today's 6.4 magnitude quake is the strongest in recent years.",
      hashtags: ["geology", "earthquake", "Myanmar", "Thailand", "faultline", "seismic"],
      media: [
        {
          type: "image",
          url: "/dummy.jpg",
        },
      ],
      timestamp: new Date(2024, 2, 22, 14, 15),
      metrics: {
        likes: 3421,
        comments: 432,
        reposts: 1876,
        views: 890000,
      },
    },
    {
      id: "post-10",
      author: {
        name: "Mark Wilson",
        handle: "markwilson",
        verified: false,
        avatar: "/placeholder.svg?height=40&width=40&text=MW",
      },
      content:
        "Sharing this video of swimming pool water sloshing during the earthquake in Bangkok. Never seen anything like this before. Stay safe everyone.",
      hashtags: ["Bangkok", "Thailand", "earthquake", "video", "scary"],
      media: [
        {
          type: "image",
          url: "/dummy.jpg",
        },
      ],
      timestamp: new Date(2024, 2, 22, 13, 25),
      metrics: {
        likes: 7654,
        comments: 987,
        reposts: 3421,
        views: 1500000,
      },
    },
    {
      id: "post-11",
      author: {
        name: "Thai Red Cross",
        handle: "ThaiRedCross",
        verified: true,
        avatar: "/placeholder.svg?height=40&width=40&text=RC",
      },
      content:
        "We've set up emergency response centers in Bangkok and near the Myanmar border. If you need assistance or want to volunteer, please contact us at the numbers below.",
      hashtags: ["RedCross", "Thailand", "Myanmar", "earthquake", "emergency", "help", "volunteer"],
      timestamp: new Date(2024, 2, 22, 18, 10),
      metrics: {
        likes: 4321,
        comments: 321,
        reposts: 2543,
        views: 670000,
      },
    },
    {
      id: "post-12",
      author: {
        name: "BBC World",
        handle: "BBCWorld",
        verified: true,
        avatar: "/placeholder.svg?height=40&width=40&text=BBC",
      },
      content:
        "Myanmar-Thailand earthquake: At least 3 people reported dead and dozens injured as 6.4 magnitude quake hits border region. Full story on our website.",
      hashtags: ["Myanmar", "Thailand", "earthquake", "breaking", "news"],
      timestamp: new Date(2024, 2, 22, 19, 30),
      metrics: {
        likes: 5432,
        comments: 876,
        reposts: 3210,
        views: 2100000,
      },
    },
  ];

  // Sort by most recent first
  return posts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

// Format numbers for display (e.g., 1500 -> 1.5K)
function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
}

// Format hashtags with proper styling
function formatContent(content: string, hashtags: string[]): JSX.Element {
  // First, escape the content to prevent XSS
  let formattedContent = content;

  // Then highlight hashtags
  hashtags.forEach((tag) => {
    const regex = new RegExp(`#${tag}`, "gi");
    formattedContent = formattedContent.replace(regex, `<span class="text-blue-500">#${tag}</span>`);
  });

  return (
    <p
      className="whitespace-pre-wrap mb-3 text-[15px] leading-6"
      dangerouslySetInnerHTML={{ __html: formattedContent }}
    />
  );
}

// Skeleton loader for posts
function PostSkeleton() {
  return (
    <Card className="w-full border-gray-200">
      <CardHeader className="flex flex-row items-center gap-4 p-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="h-3 w-16 ml-auto" />
      </CardHeader>

      <CardContent className="p-4 pt-0">
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6 mb-2" />
        <Skeleton className="h-4 w-4/6 mb-4" />
        <Skeleton className="h-48 w-full rounded-md" />
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <div className="flex items-center justify-between w-full">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-8" />
        </div>
      </CardFooter>
    </Card>
  );
}

export default function MichealDisasterFeed() {
  const [posts, setPosts] = useState<XPost[]>([]);
  const [visiblePosts, setVisiblePosts] = useState<XPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<string>("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const postsPerPage = 5;

  // Simulate fetching posts
  useEffect(() => {
    setLoading(true);

    // Simulate API delay
    const timer = setTimeout(() => {
      const newPosts = generateDisasterPosts();
      setPosts(newPosts);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Apply filters and pagination
  useEffect(() => {
    let filtered = [...posts];

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.content.toLowerCase().includes(term) ||
          post.author.name.toLowerCase().includes(term) ||
          post.author.handle.toLowerCase().includes(term) ||
          post.hashtags.some((tag) => tag.toLowerCase().includes(term)),
      );
    }

    // Apply sorting
    if (sortBy === "latest") {
      filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    } else if (sortBy === "popular") {
      filtered.sort((a, b) => b.metrics.reposts + b.metrics.likes - (a.metrics.reposts + a.metrics.likes));
    }

    // Calculate total pages
    const totalPages = Math.ceil(filtered.length / postsPerPage);
    setTotalPages(totalPages);

    // Ensure current page is valid
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }

    // Apply pagination
    const startIndex = (currentPage - 1) * postsPerPage;
    const paginatedPosts = filtered.slice(startIndex, startIndex + postsPerPage);
    setVisiblePosts(paginatedPosts);
  }, [posts, currentPage, searchTerm, sortBy, postsPerPage]);

  // Function to handle liking a post
  const handleLike = (postId: string) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            metrics: {
              ...post.metrics,
              likes: post.metrics.likes + 1,
            },
          };
        }
        return post;
      }),
    );
  };

  // Function to handle reposting
  const handleRepost = (postId: string) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            metrics: {
              ...post.metrics,
              reposts: post.metrics.reposts + 1,
            },
          };
        }
        return post;
      }),
    );
  };

  // Function to refresh the feed
  const handleRefresh = () => {
    setLoading(true);
    setCurrentPage(1);

    // Simulate API delay
    setTimeout(() => {
      const newPosts = generateDisasterPosts();
      setPosts(newPosts);
      setLoading(false);
    }, 800);
  };

  // Format relative time (e.g., "2h" for 2 hours ago)
  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds}s`;
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)}m`;
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)}h`;
    } else {
      return format(date, "MMM d");
    }
  };

  // Function to handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="w-full h-full overflow-auto px-1 sm:px-2 md:px-4">
      <div className="max-w-md sm:max-w-lg md:max-w-2xl mx-auto">
        <div className="flex flex-col gap-2 mb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold">Micheal</h2>
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading} className="ml-auto">
              <RefreshCw className={`h-4 w-4 mr-1 sm:mr-2 ${loading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">Real-time disaster updates from X (formerly Twitter)</p>
        </div>

        {/* Filters and search */}
        <div className="grid gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground border-black" />
              <Input
                placeholder="Search disaster updates..."
                className="pl-8 border-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <Tabs defaultValue="latest" value={sortBy} onValueChange={setSortBy} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="latest">Latest</TabsTrigger>
              <TabsTrigger value="popular">Most Shared</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Post list */}
        <div className="space-y-3">
          {loading && currentPage === 1 ? (
            // Initial loading state
            Array(3)
              .fill(0)
              .map((_, index) => <PostSkeleton key={`skeleton-${index}`} />)
          ) : visiblePosts.length > 0 ? (
            // Posts list
            visiblePosts.map((post) => (
              <Card key={post.id} className="w-full border-gray-200">
                <CardHeader className="flex flex-row items-start gap-3 p-3 pb-0">
                  <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                    <AvatarImage src={post.author.avatar} alt={post.author.name} />
                    <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-sm sm:text-base">{post.author.name}</span>
                      {post.author.verified && (
                        <svg className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
                        </svg>
                      )}
                    </div>
                    <span className="text-xs sm:text-sm text-muted-foreground">{post.author.handle}</span>
                  </div>
                  <div className="ml-auto flex items-center gap-1">
                    <span className="text-xs sm:text-sm text-muted-foreground">{formatRelativeTime(post.timestamp)}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6 sm:h-8 sm:w-8 rounded-full">
                      <MoreHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="p-3 pt-2">
                  {formatContent(post.content, post.hashtags)}

                  {post.media && post.media.length > 0 && (
                    <div className="mt-2 rounded-lg overflow-hidden">
                      {post.media.map((media, index) =>
                        media.type === "image" ? (
                          <div key={index} className="relative h-48 sm:h-64 w-full">
                            <Image
                              src={media.url || "/placeholder.svg"}
                              alt="Post media"
                              fill
                              className="object-cover rounded-lg"
                            />
                          </div>
                        ) : (
                          <video key={index} src={media.url} controls className="w-full rounded-lg" />
                        ),
                      )}
                    </div>
                  )}

                  <div className="mt-2 text-xs sm:text-sm text-muted-foreground">{formatNumber(post.metrics.views)} views</div>
                </CardContent>

                <CardFooter className="p-2 pt-0">
                  <div className="flex items-center justify-between w-full">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1 text-gray-500 hover:text-red-500 px-1 sm:px-2"
                      onClick={() => handleLike(post.id)}
                    >
                      <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="text-xs sm:text-sm">{formatNumber(post.metrics.likes)}</span>
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1 text-gray-500 hover:text-blue-500 px-1 sm:px-2"
                    >
                      <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="text-xs sm:text-sm">{formatNumber(post.metrics.comments)}</span>
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1 text-gray-500 hover:text-green-500 px-1 sm:px-2"
                      onClick={() => handleRepost(post.id)}
                    >
                      <Repeat className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="text-xs sm:text-sm">{formatNumber(post.metrics.reposts)}</span>
                    </Button>

                    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-500 px-1 sm:px-2">
                      <Share2 className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>

                    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-500 px-1 sm:px-2">
                      <Bookmark className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))
          ) : (
            // No results
            <div className="text-center py-6">
              <p className="text-muted-foreground">No posts found matching your criteria</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          )}
        </div>
      </div>
    </div>
  );
}