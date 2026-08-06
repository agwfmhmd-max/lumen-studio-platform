import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
const Home = lazy(() => import("./pages/Home"));
const Admin = lazy(() => import("./pages/Admin"));
const About = lazy(() => import("./pages/ContentPages").then(mod => ({ default: mod.About })));
const Contact = lazy(() => import("./pages/ContentPages").then(mod => ({ default: mod.Contact })));
const Journal = lazy(() => import("./pages/ContentPages").then(mod => ({ default: mod.Journal })));
const PostDetail = lazy(() => import("./pages/ContentPages").then(mod => ({ default: mod.PostDetail })));
const ProjectDetail = lazy(() => import("./pages/ContentPages").then(mod => ({ default: mod.ProjectDetail })));
const ServiceDetail = lazy(() => import("./pages/ContentPages").then(mod => ({ default: mod.ServiceDetail })));
const Services = lazy(() => import("./pages/ContentPages").then(mod => ({ default: mod.Services })));
const Work = lazy(() => import("./pages/ContentPages").then(mod => ({ default: mod.Work })));

function Router() {
  return <Suspense fallback={<div className="grid min-h-screen place-items-center bg-[#090909] text-sm text-[#a6a19a]">Loading Lumen…</div>}><Switch>
    <Route path="/" component={Home} />
    <Route path="/about" component={About} />
    <Route path="/services" component={Services} />
    <Route path="/services/:slug" component={ServiceDetail} />
    <Route path="/work" component={Work} />
    <Route path="/work/:slug" component={ProjectDetail} />
    <Route path="/journal" component={Journal} />
    <Route path="/journal/:slug" component={PostDetail} />
    <Route path="/contact" component={Contact} />
    <Route path="/admin" component={Admin} />
    <Route path="/404" component={NotFound} />
    <Route component={NotFound} />
  </Switch></Suspense>;
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
