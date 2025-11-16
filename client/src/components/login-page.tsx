import React from "react";
import { Card, CardHeader, CardBody, CardFooter, Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

interface LoginPageProps {
  onLogin: (role: "owner" | "iot" | "cloud") => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background login-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl border border-primary-100">
          <CardHeader className="flex flex-col items-center gap-4 pb-8 pt-6">
            <div className="purple-gradient w-20 h-20 rounded-full flex items-center justify-center shadow-lg">
              <Icon icon="lucide:car" className="text-white text-4xl" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-500">
                SmartCar Dashboard
              </h1>
              <p className="text-foreground-500 mt-2">
                Please select your role to continue
              </p>
            </div>
          </CardHeader>
          
          <CardBody className="space-y-6 px-8">
            {/* Car Owner Button - Keep Purple */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="shadow-sm"
            >
              <Button 
                fullWidth
                size="lg"
                className="h-20 bg-gradient-to-r from-primary-600 to-primary-500"
                startContent={
                  <div className="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center mr-2">
                    <Icon icon="lucide:user" className="text-white text-xl" />
                  </div>
                }
                onPress={() => onLogin("owner")}
              >
                <div className="flex flex-col items-start">
                  <span className="font-semibold text-lg text-white">Car Owner</span>
                  <span className="text-xs text-white/80">Access your vehicle dashboard</span>
                </div>
              </Button>
            </motion.div>
            
            {/* IoT Staff Button - Change to Blue */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="shadow-sm"
            >
              <Button 
                fullWidth
                size="lg"
                className="h-20 bg-gradient-to-r from-blue-600 to-blue-500"
                startContent={
                  <div className="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center mr-2">
                    <Icon icon="lucide:cpu" className="text-white text-xl" />
                  </div>
                }
                onPress={() => onLogin("iot")}
              >
                <div className="flex flex-col items-start">
                  <span className="font-semibold text-lg text-white">IoT Staff</span>
                  <span className="text-xs text-white/80">Manage device infrastructure</span>
                </div>
              </Button>
            </motion.div>
            
            {/* Cloud Staff Button - Change to Orange */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="shadow-sm"
            >
              <Button 
                fullWidth
                size="lg"
                className="h-20 bg-gradient-to-r from-orange-600 to-orange-500"
                startContent={
                  <div className="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center mr-2">
                    <Icon icon="lucide:cloud" className="text-white text-xl" />
                  </div>
                }
                onPress={() => onLogin("cloud")}
              >
                <div className="flex flex-col items-start">
                  <span className="font-semibold text-lg text-white">Cloud Staff</span>
                  <span className="text-xs text-white/80">Monitor system infrastructure</span>
                </div>
              </Button>
            </motion.div>
          </CardBody>
          
          <CardFooter className="flex flex-col gap-3 pt-4 pb-6">
            <div className="w-full h-px bg-gradient-to-r from-transparent via-primary-200 to-transparent mb-2"></div>
            <p className="text-xs text-center text-foreground-500">
              By logging in, you agree to our Terms of Service and Privacy Policy
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="light" size="sm" color="primary" startContent={<Icon icon="lucide:help-circle" />}>
                Help
              </Button>
              <Button variant="light" size="sm" color="primary" startContent={<Icon icon="lucide:info" />}>
                About
              </Button>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};