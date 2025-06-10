import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DigitalOceanDeployment from "@/components/DigitalOceanDeployment";

const cardData = [
	{
		id: 1,
		title: "Project Alpha",
		description: "A modern web application built with Next.js and TypeScript",
		content:
			"This project showcases advanced React patterns, server-side rendering, and responsive design principles.",
		badge: "Featured",
		buttonText: "View Project",
	},
	{
		id: 2,
		title: "Design System",
		description: "Comprehensive UI component library with Shadcn/ui",
		content:
			"A collection of reusable components built with Tailwind CSS and Radix UI primitives for consistent design.",
		badge: "Popular",
		buttonText: "Explore",
	},
	{
		id: 3,
		title: "API Integration",
		description: "RESTful API with authentication and data management",
		content:
			"Secure backend services with JWT authentication, database integration, and real-time updates.",
		badge: "New",
		buttonText: "Learn More",
	},
	{
		id: 4,
		title: "Mobile App",
		description: "Cross-platform mobile application development",
		content:
			"React Native application with native performance and seamless user experience across platforms.",
		badge: "Trending",
		buttonText: "Download",
	},
	{
		id: 5,
		title: "Data Analytics",
		description: "Business intelligence and data visualization platform",
		content:
			"Interactive dashboards and reports with real-time data processing and advanced analytics capabilities.",
		badge: "Premium",
		buttonText: "Get Started",
	},
	{
		id: 6,
		title: "AI Integration",
		description: "Machine learning and artificial intelligence solutions",
		content:
			"Cutting-edge AI features including natural language processing, computer vision, and predictive analytics.",
		badge: "Beta",
		buttonText: "Try Now",
	},
];

export default function Home() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
			<div className="max-w-md mx-auto">
				{/* Mobile Header */}
				<div className="text-center mb-8">
					<h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
						Our Platform PWA 🚀
					</h1>
					<p className="text-sm text-slate-600 dark:text-slate-400">
						Hot reload enabled! PWA disabled in dev mode.
					</p>
				</div>

				{/* Mobile-First 2x3 Grid: 2 columns × 3 rows = 6 square cards */}
				<div className="grid grid-cols-2 gap-3">
					{cardData.map((card) => (
						<Card
							key={card.id}
							className="aspect-square flex flex-col hover:shadow-md transition-shadow duration-300 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
						>
							<CardHeader className="pb-2 p-3 flex-none">
								<Badge variant="secondary" className="text-xs mb-2 w-fit">
									{card.badge}
								</Badge>
								<CardTitle className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-tight">
									{card.title}
								</CardTitle>
							</CardHeader>
							<CardContent className="p-3 pt-0 flex-1 flex items-center">
								<p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed line-clamp-3">
									{card.content}
								</p>
							</CardContent>
							<CardFooter className="p-3 pt-0 flex-none">
								<Button size="sm" className="w-full text-xs bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 dark:text-slate-900">
									{card.buttonText}
								</Button>
							</CardFooter>
						</Card>
					))}
				</div>

				{/* DigitalOcean Deployment Section */}
				<div className="mt-8">
					<DigitalOceanDeployment />
				</div>
			</div>
		</div>
	);
}
