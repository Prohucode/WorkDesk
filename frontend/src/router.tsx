import { createBrowserRouter } from "react-router-dom"

import { Layout } from "@/components/ui/layout"
import { DashboardPage } from "@/pages/dashboard"
import { WorkLogsPage } from "@/pages/work-logs"

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                index: true,
                element: <DashboardPage />,
            },
            {
                path: "work-logs",
                element: <WorkLogsPage />,
            },
        ],
    },
])
