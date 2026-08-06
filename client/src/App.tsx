import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider, useLanguage } from "./contexts/LanguageContext";
const Home = lazy(() => import("./pages/Home"));
const Admin = lazy(() => import("./pages/Admin"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const About = lazy(() => import("./pages/ContentPages").then(mod => ({ default: mod.About })));
const Contact = lazy(() => import("./pages/ContentPages").then(mod => ({ default: mod.Contact })));
const Journal = lazy(() => import("./pages/ContentPages").then(mod => ({ default: mod.Journal })));
const PostDetail = lazy(() => import("./pages/ContentPages").then(mod => ({ default: mod.PostDetail })));
const ProjectDetail = lazy(() => import("./pages/ContentPages").then(mod => ({ default: mod.ProjectDetail })));
const ServiceDetail = lazy(() => import("./pages/ContentPages").then(mod => ({ default: mod.ServiceDetail })));
const Services = lazy(() => import("./pages/ContentPages").then(mod => ({ default: mod.Services })));
const Work = lazy(() => import("./pages/ContentPages").then(mod => ({ default: mod.Work })));

function Router() {
  const { t } = useLanguage();
  return <Suspense fallback={<div className="grid min-h-screen place-items-center bg-[#090909] text-sm text-[#a6a19a]">{t("loading")}</div>}><Switch>
    <Route path="/" component={Home} />
    <Route path="/about" component={About} />
    <Route path="/services" component={Services} />
    <Route path="/services/:slug" component={ServiceDetail} />
    <Route path="/work" component={Work} />
    <Route path="/work/:slug" component={ProjectDetail} />
    <Route path="/journal" component={Journal} />
    <Route path="/journal/:slug" component={PostDetail} />
    <Route path="/contact" component={Contact} />
    <Route path="/admin/login" component={AdminLogin} />
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
        <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
