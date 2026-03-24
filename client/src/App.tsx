import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import FeedbackButton from "./components/FeedbackButton";
import Home from "./pages/Home";
import PDV from "./pages/PDV";
import Pedidos from "./pages/Pedidos";
import Produtos from "./pages/Produtos";
import Dashboards from "./pages/Dashboards";
import Concorrencia from "./pages/Concorrencia";
import Configuracoes from "./pages/Configuracoes";
import ProjectDetails from "./pages/ProjectDetails";
import ForgeLayout from "./components/ForgeLayout";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={ProjectDetails} />
      <Route path={"/home"} component={Home} />
      <Route path={"/pdv"}>
        {() => (
          <ForgeLayout>
            <PDV />
          </ForgeLayout>
        )}
      </Route>
      <Route path={"/pedidos"}>
        {() => (
          <ForgeLayout>
            <Pedidos />
          </ForgeLayout>
        )}
      </Route>
      <Route path={"/produtos"}>
        {() => (
          <ForgeLayout>
            <Produtos />
          </ForgeLayout>
        )}
      </Route>
      <Route path={"/dashboards"}>
        {() => (
          <ForgeLayout>
            <Dashboards />
          </ForgeLayout>
        )}
      </Route>
      <Route path={"/concorrencia"}>
        {() => (
          <ForgeLayout>
            <Concorrencia />
          </ForgeLayout>
        )}
      </Route>
      <Route path={"/configuracoes"}>
        {() => (
          <ForgeLayout>
            <Configuracoes />
          </ForgeLayout>
        )}
      </Route>
      <Route path={"/projeto"} component={ProjectDetails} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
      >
        <TooltipProvider>
          <Toaster />
          <Router />
          <FeedbackButton />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
