import { Provider } from "@/components/ui/provider";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./utils/queryClient";
import { AuthProvider } from "./contexts/AuthContext";
import StatCard from "./components/common/StatCard";

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
                      <StatCard label="hello" value="world" trend="up" />
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
