import DashboardLayout from "@/layouts/dashboard";
import {
  Box,
  Breadcrumbs,
  Button,
  Sheet,
  Typography,
  Table,
  Tooltip,
} from "@mui/joy";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosAdd } from "react-icons/io";
import Link from "next/link";
import dynamic from "next/dynamic";
const Lottie = dynamic(
  () => import("lottie-react").then((module) => module.default),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  }
);
import animation from "../../../public/empty.json";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { FaCircleInfo } from "react-icons/fa6";

export default function ViewApplicationPage() {
  const [applications, setApplications] = useState();
  const { userId } = useAuth();

  const fetchApplications = async () => {
    const applications = await fetch(`/api/application/${userId}`, {
      method: "GET",
    });

    if (!applications.ok) {
      throw new Error("Something wrong, please contact our support");
    }

    const data = await applications.json();

    console.log(data, "...application");

    setApplications(data);
  };

  useEffect(() => {
    fetchApplications();
  }, [userId]);

  const breadcrumbs = [
    {
      name: "Dashboard",
      link: "/kiosk-application/user",
    },
    { name: "Kiosk application", link: "/kiosk-application/user" },
    // {
    //   name: "New application",
    //   link: "/kiosk-application/user/apply-application",
    // },
  ];

  return (
    <DashboardLayout>
      <Box sx={{ mt: 10 }}>
        <Breadcrumbs
          separator={<IoIosArrowForward />}
          aria-label="breadcrumbs"
          sx={{ px: 0 }}
        >
          {breadcrumbs.map((item, index) => (
            <Link key={index} color="neutral" href={item.link}>
              {item.name}
            </Link>
          ))}
        </Breadcrumbs>

        <Typography level="h2">Kiosk application</Typography>

        <Box sx={{ mt: 5 }}>
          <Box sx={{ display: "flex", flexDirection: "row-reverse" }}>
            <Link href={"/kiosk-application/user/apply-kiosk"}>
              <Button sx={{ mr: 1 }} startDecorator={<IoIosAdd size={20} />}>
                New application
              </Button>
            </Link>
          </Box>
          <Sheet
            variant="outlined"
            sx={{
              borderRadius: 15,
              mt: 2,
              position: "relative",
              py: 5,
              px: 5,
              display: "flex",
              justifyContent: "center",
            }}
          >
            {applications && applications.length > 0 ? (
              <Table
                aria-label="basic table"
                borderAxis="xBetween"
                size="md"
                stickyFooter={false}
                stickyHeader={false}
                variant="plain"
              >
                <thead>
                  <tr>
                    <th style={{ width: "40%" }}>Business</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Created Date</th>
                  </tr>
                </thead>
                <tbody>
                  {applications?.map((d, index) => (
                    <tr key={index}>
                      <td>
                        <Box>
                          <Typography level="title-sm">
                            {d.business.name}
                          </Typography>
                          <Typography level="body-xs">{`SSM: ${d.business.ssmNo}`}</Typography>
                        </Box>
                      </td>
                      <td>
                        <Typography level="title-sm" color="neutral">
                          {`+60${d.business.phoneNo}`}
                        </Typography>
                      </td>
                      <td>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Sheet
                            variant="solid"
                            color="primary"
                            sx={{
                              width: "fit-content",
                              color: "white",
                              px: 1,
                              py: 0.1,
                              borderRadius: 20,
                              display: "flex",
                              alignItems: "center",
                              mr: 1,
                            }}
                          >
                            <Typography level="title-sm" color="white">
                              {d.status ? d.status : "Pending"}
                            </Typography>
                          </Sheet>
                          {/* <Tooltip
                            title="Delete"
                            variant="solid"
                            placement="bottom"
                          >
                            <Box>
                              <FaCircleInfo size={15} />
                            </Box>
                          </Tooltip> */}
                        </Box>
                      </td>
                      <td>
                        <Typography level="title-sm" color="neutral">
                          {new Date(d.createdDate).toLocaleDateString()}
                        </Typography>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <Box sx={{ position: "relative", width: 300 }}>
                <Lottie animationData={animation} loop={true} />
                <Typography level="h3" textAlign={"center"}>
                  No application found
                </Typography>
              </Box>
            )}
          </Sheet>
        </Box>
      </Box>
    </DashboardLayout>
  );
}
