import { Provider } from "@/components/ui/provider";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./utils/queryClient";
import { AuthProvider } from "./contexts/AuthContext";
import AlertBadge from "./components/common/AlertBadge";

const App = () => {
  return (
    <>
      <Provider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <Router>
              <Routes>
                <Route
                  path="/"
                  element={
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100vh",
                        fontSize: "24px",
                        fontWeight: "bold",
                      }}
                    >
                      <AlertBadge />
                    </div>
                  }
                />
              </Routes>
            </Router>
          </AuthProvider>
        </QueryClientProvider>
      </Provider>
    </>
  );
};

export default App;
