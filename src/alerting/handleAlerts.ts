import { Alert } from "@prisma/client";
import { prisma } from "../config";
import { sendMail } from "./email";

const handleAlert = async (alert: Alert) => {
  // 3) check if alert condition is met
  // Currently, the only supported expression is checking if more than two
  // users queried the same project in the last 5 minutes.

  // 3.1) Get the project
  const enrichedAlert = await prisma.alert.findUnique({
    where: {
      aid: alert.aid,
    },
    include: {
      schema: {
        include: {
          project: true,
        },
      },
      users: {
        include: {
          user: {
            select: {
              email: true,
            },
          },
        },
      },
      roles: {
        include: {
          role: {
            include: {
              users: {
                include: {
                  user: {
                    select: {
                      email: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!enrichedAlert) {
    return;
  }

  // 3.2) Get the project's last 1 minutes of queries
  let startTime = new Date(new Date().setMinutes(new Date().getMinutes() - 1));
  const endTime = new Date();

  const queriedUsers = await prisma.user.findMany({
    select: {
      uid: true,
    },
    where: {
      jobs: {
        some: {
          issuedAt: {
            gte: startTime,
          },
          pid: enrichedAlert.schema.project.pid,
        },
      },
    },
  });

  // 3.3) If more than 2 users queried the project in the last 5 minutes, send an email
  if (queriedUsers.length > 2) {
    const subject = `Alert for project ${enrichedAlert.schema.project.name}`;
    const text = `More than 2 users queried the project ${enrichedAlert.schema.project.name} in the last minute.`;

    // 3.4) Get all emails
    const emails = enrichedAlert.users.map((user) => user.user.email);
    const roleEmails = enrichedAlert.roles
      .map((role) => role.role.users.map((user) => user.user.email))
      .flat();

    // 3.5) Send the email
    await sendMail([...emails, ...roleEmails].join(","), subject, text);
  }
};

export const handleAlerts = async () => {
  // 1) Find all active alerts
  const projects = await prisma.project.findMany({
    include: {
      schemas: {
        orderBy: {
          sid: "desc",
        },
        take: 1,
        include: {
          alerts: true,
        },
      },
    },
  });

  const alerts: Alert[][] = [];
  projects.forEach((project) => {
    if (project.schemas.length > 0) {
      alerts.push(project.schemas[0].alerts);
    }
  });

  // 2) Handle each alert
  alerts.forEach((alertList) => {
    alertList.forEach((alert) => {
      handleAlert(alert);
    });
  });
};
