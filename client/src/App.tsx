import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Trails from "./pages/Trails";
import TrailDetail from "./pages/TrailDetail";
import ModuleViewer from "./pages/ModuleViewer";
import Quiz from "./pages/Quiz";
import Ranking from "./pages/Ranking";
import Admin from "./pages/Admin";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Login} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/trilhas" component={Trails} />
      <Route path="/trilhas/:slug" component={TrailDetail} />
      <Route path="/modulo/:id" component={ModuleViewer} />
      <Route path="/quiz/:id" component={Quiz} />
      <Route path="/ranking" component={Ranking} />
      <Route path="/admin" component={Admin} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

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
