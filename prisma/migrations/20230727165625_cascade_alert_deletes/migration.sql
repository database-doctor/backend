-- DropForeignKey
ALTER TABLE "AlertHistory" DROP CONSTRAINT "AlertHistory_aid_fkey";

-- DropForeignKey
ALTER TABLE "AlertNotification" DROP CONSTRAINT "AlertNotification_aid_fkey";

-- DropForeignKey
ALTER TABLE "AlertRoleMap" DROP CONSTRAINT "AlertRoleMap_aid_fkey";

-- DropForeignKey
ALTER TABLE "AlertUserMap" DROP CONSTRAINT "AlertUserMap_aid_fkey";

-- AddForeignKey
ALTER TABLE "AlertHistory" ADD CONSTRAINT "AlertHistory_aid_fkey" FOREIGN KEY ("aid") REFERENCES "Alert"("aid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlertUserMap" ADD CONSTRAINT "AlertUserMap_aid_fkey" FOREIGN KEY ("aid") REFERENCES "Alert"("aid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlertRoleMap" ADD CONSTRAINT "AlertRoleMap_aid_fkey" FOREIGN KEY ("aid") REFERENCES "Alert"("aid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlertNotification" ADD CONSTRAINT "AlertNotification_aid_fkey" FOREIGN KEY ("aid") REFERENCES "Alert"("aid") ON DELETE CASCADE ON UPDATE CASCADE;
