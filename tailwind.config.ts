import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			michael_red_100: "#DC2828",
  			michael_red_50: "#DC282880",
  			michael_red_20: "#DC282833",
  			michael_red_10: "#DC28281A",
  			michael_dark_red_50: "#4F131380",
  			michael_dark_red_75: "#4F1313BF",
  			michael_black_1: "#181A2A",
  			michael_black_2: "#3B3C4A",
  			michael_black_3: "#161722",
  			michael_gray_1: "#696A75",
  			michael_gray_2: "#D9D9D9",
  			michael_gray_3: "#535353",
  			michael_gray_4: "#AAAAAA",
  			michael_gray_5: "#6B6B6B",
  			michael_gray_6: "#B1B1B142",
  			michael_gray_7: "#97989F",
  			michael_bg: "#F5F7FA",
  			background: "hsl(var(--background))",
  			foreground: "hsl(var(--foreground))",
  			card: {
  				DEFAULT: "hsl(var(--card))",
  				foreground: "hsl(var(--card-foreground))",
  			},
  			popover: {
  				DEFAULT: "hsl(var(--popover))",
  				foreground: "hsl(var(--popover-foreground))",
  			},
  			primary: {
  				DEFAULT: "hsl(var(--primary))",
  				foreground: "hsl(var(--primary-foreground))",
  			},
  			secondary: {
  				DEFAULT: "hsl(var(--secondary))",
  				foreground: "hsl(var(--secondary-foreground))",
  			},
  			muted: {
  				DEFAULT: "hsl(var(--muted))",
  				foreground: "hsl(var(--muted-foreground))",
  			},
  			accent: {
  				DEFAULT: "hsl(var(--accent))",
  				foreground: "hsl(var(--accent-foreground))",
  			},
  			destructive: {
  				DEFAULT: "hsl(var(--destructive))",
  				foreground: "hsl(var(--destructive-foreground))",
  			},
  			border: "hsl(var(--border))",
  			input: "hsl(var(--input))",
  			ring: "hsl(var(--ring))",
  			chart: {
  				"1": "hsl(var(--chart-1))",
  				"2": "hsl(var(--chart-2))",
  				"3": "hsl(var(--chart-3))",
  				"4": "hsl(var(--chart-4))",
  				"5": "hsl(var(--chart-5))",
  			},
  			sidebar: {
  				DEFAULT: "hsl(var(--sidebar-background))",
  				foreground: "hsl(var(--sidebar-foreground))",
  				primary: "hsl(var(--sidebar-primary))",
  				"primary-foreground": "hsl(var(--sidebar-primary-foreground))",
  				accent: "hsl(var(--sidebar-accent))",
  				"accent-foreground": "hsl(var(--sidebar-accent-foreground))",
  				border: "hsl(var(--sidebar-border))",
  				ring: "hsl(var(--sidebar-ring))",
  			},
  		},
  		borderRadius: {
  			lg: "var(--radius)",
  			md: "calc(var(--radius) - 2px)",
  			sm: "calc(var(--radius) - 4px)",
  		},
  	},
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/forms")],
} satisfies Config;
